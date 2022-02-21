import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserContext } from '../UserContext.js';
import changeCallData from '../actions/calldata-actions.js';
import { StrifeLive } from '../services/strife-live.js';
import * as socketService from '../services/socket-service.js';
import useAudio from './useAudio.jsx';
import * as CONSTANTS from '../constants/strife-constants.js';

const usePhone = (socket, remoteAudioRef) => {
  const dispatch = useDispatch();
  const callData = useSelector((state) => state.callData);
  const { user } = useContext(UserContext);
  const [peerConnection, setPeerConnection] = useState(null);
  const [iceCandidates, setIceCandidates] = useState([]);
  const [callError, setCallError] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [callNotify, stopCallNotify] = useAudio(
    CONSTANTS.urls.phoneCallSoundSrc,
  );

  useEffect(() => {
    (async function () {
      if (!socket) return;

      // Receive updated ice candidates
      socketService.addEventListener(
        socket,
        'get-ice-candidate',
        async (candidateInfo) => {
          console.log('Received new ICE candidate from server', candidateInfo);
          if (callData.isCallIncoming || callData.isCallConnected) {
            await StrifeLive.addIceCandidate(candidateInfo.candidate);
          } else {
            console.log('Offer not set, caching ICE candidate');
            setIceCandidates((prev) => [...prev, candidateInfo.candidate]);
          }
        },
      );

      // Receive offer from incoming call
      socketService.addEventListener(socket, 'get-offer', async (offerData) => {
        dispatch(
          changeCallData({
            isCallActive: true,
          }),
        );
        console.log('Received offer from server:', offerData);

        await StrifeLive.setOffer(offerData.offer);
        dispatch(
          changeCallData({
            participant: offerData.caller.username,
            callDuration: 0,
            isCallIncoming: true,
            isCallActive: true,
            isCallConnected: false,
          }),
        );
        callNotify(true);
      });

      socketService.addEventListener(socket, 'end-call', end);

      await setupPeerConnection();
    })();
  }, [socket]);

  useEffect(() => {
    if (!peerConnection) return;
    peerConnection.onaddstream = (e) => {
      console.log('Setting remote audio stream');
      remoteAudioRef.current.srcObject = e?.stream;
    };

    if (callData.participant) {
      peerConnection.onicecandidate = (e) => {
        if (!e.candidate) return;
        const candidateInfo = {
          candidate: e.candidate,
          receiver: callData.participant,
        };
        console.log('Sending ICE candidate to:', callData.participant);
        socketService.emit(socket, 'new-ice-candidate', candidateInfo);
      };
    }
  }, [peerConnection, callData]);

  // Handle mic mute/unmute
  useEffect(() => {
    if (callData.isCallConnected) StrifeLive.muteAudio(!micMuted);
  }, [micMuted]);

  async function create(recipientName) {
    dispatch(
      changeCallData({
        participant: recipientName,
        callDuration: 0,
        isCallIncoming: false,
        isCallActive: true,
        isCallConnected: false,
      }),
    );
    const offer = await StrifeLive.createOffer();
    const offerData = {
      caller: user,
      receiver: recipientName,
      offer: offer,
    };

    socketService.addEventListener(socket, 'get-answer', async (answerData) => {
      console.log('Received answer from server');
      await StrifeLive.setAnswer(answerData.answer);
      dispatch(
        changeCallData({
          participant: recipientName,
          callDuration: 0,
          isCallIncoming: false,
          isCallActive: true,
          isCallConnected: true,
        }),
      );

      if (iceCandidates.length > 0) {
        console.log('Found cached ICE candidates');
        iceCandidates.forEach(async (candidate) => {
          await StrifeLive.addIceCandidate(candidate);
        });
        setIceCandidates([]);
      }
    });

    socketService.emit(socket, 'get-offer', offerData, [
      (status) => {
        if (!status) {
          // means the recipient is on another call
          setCallError(true);
          setTimeout(() => {
            end();
          }, 1000);
        }
      },
    ]);
    console.log('Sent offer to:', recipientName);
  }

  async function accept() {
    const answer = await StrifeLive.createAnswer();
    const answerData = {
      caller: callData.participant,
      receiver: user.username,
      answer: answer,
    };

    socketService.emit(socket, 'get-answer', answerData);
    dispatch(
      changeCallData({
        participant: callData.participant,
        callDuration: 0,
        isCallIncoming: false,
        isCallActive: true,
        isCallConnected: true,
      }),
    );
    stopCallNotify();

    if (iceCandidates.length > 0) {
      console.log('Found cached ICE candidates');
      iceCandidates.forEach(async (candidate) => {
        await StrifeLive.addIceCandidate(candidate);
      });
      setIceCandidates([]);
    }
  }

  function end(broadcast) {
    if (broadcast) socketService.emit(socket, 'end-call');
    StrifeLive.endCall();
    dispatch(
      changeCallData({
        participant: '',
        callDuration: 0,
        isCallIncoming: false,
        isCallActive: false,
        isCallConnected: false,
      }),
    );
    stopCallNotify();
    setupPeerConnection();
  }

  async function setupPeerConnection() {
    let myAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    setPeerConnection(StrifeLive.createPeerConnection(myAudioStream));
  }

  const muteMic = {
    status: micMuted,
    toggle: setMicMuted,
  };

  return [create, accept, end, muteMic, { callError, setCallError }];
};

export default usePhone;
