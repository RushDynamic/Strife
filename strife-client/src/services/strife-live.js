class StrifeLive {
  constructor() {
    this._peerConnectionConfig = {
      iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
    };
  }

  /**
   * Create a new RTCPeerConnection object and add the input stream to it
   * @param {navigator.mediaDevices.getUserMedia()} stream
   * @param {} config
   * @returns {RTCPeerConnection} New instance of RTCPeerConnection
   */
  createPeerConnection(stream, config = this._peerConnectionConfig) {
    const peerConnection = new RTCPeerConnection(config);
    this.peerConnection = peerConnection;

    // TODO: Switch to addTrack from addStream
    this.peerConnection.addStream(stream);
    return this.peerConnection;
  }

  /**
   * Create a new offer and set it as the peerConnection's local description
   * @returns {RTCSessionDescription} A new offer object
   */
  async createOffer() {
    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);
    return {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
  }

  /**
   * Receive and update new ICE candidates from the remote peer (through signaling server)
   * @param {RTCIceCandidate} iceCandidate
   */
  async addIceCandidate(iceCandidate) {
    this.peerConnection?.addIceCandidate(iceCandidate);
  }

  /**
   * Receive an offer from a remote peer and set it as the remote description
   * @param {RTCSessionDescription} offer
   */
  async setOffer(offer) {
    await this.peerConnection.setRemoteDescription(offer);
    console.log('Done setting offer');
  }

  /**
   *
   * @returns {RTCSessionDescriptionInit} A new answer object for an already received offer.
   *      The answer contains information about any media already attached to the session, codecs and options supported by the browser, and any ICE candidates already gathered
   */
  async createAnswer() {
    if (!this.peerConnection.localDescription) {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      console.log(
        'Completed creating answer:',
        JSON.stringify(this.peerConnection.localDescription),
      );
      return answer;
    }
  }

  /**
   * Accepts an RTCSessionDescription object and sets it as the remote description for the PeerConnection
   * @param {RTCSessionDescriptionInit} answer
   */
  async setAnswer(answer) {
    await this.peerConnection.setRemoteDescription(answer);
    console.log('Done setting answer');
  }
}

const instance = new StrifeLive();
export { instance as StrifeLive };
