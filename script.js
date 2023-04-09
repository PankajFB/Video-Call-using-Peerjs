// we stored the object in the peer
var peer = new Peer();

// to store the local video stream
let localVideoStream;

// to get the camera and mic access

const getLocalVideo = async (e) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localVideoStream = stream;
  console.log(stream);
  const video = document.getElementById("localstream");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
};

getLocalVideo();

// to get the id of the peer when the connection is established
peer.on("open", (id) => {
  console.log("My peer ID is: " + id);
  const userid = peer.id;
  console.log(id);

  //   to display the id in the html page
  const useridinput = document.getElementById("userid");
  useridinput.value = userid;
});

const btn = document.getElementById("call");

// to send the connection to the other peer
btn.addEventListener("click", () => {
  const remoteid = document.getElementById("remoteid").value;
  console.log(remoteid);

  // to start the connection
  //   the remoteid is the target id to connect
  const call = peer.call(remoteid, localVideoStream);


  call.on("stream", (remoteStream) => {
    console.log("video stream is coming");
    const remotevideo = document.getElementById("remotestream");
    remotevideo.srcObject = remoteStream;
    remotevideo.addEventListener("loadedmetadata", () => {
      remotevideo.play();
    });
  });


  const msg = document.getElementById("msg");
  const send = document.getElementById("send");

  //   to send the message
  send.addEventListener("click", () => {
    const msgvalue = msg.value;
    console.log(msgvalue);
    conn.send(msgvalue);
    console.log("message sent");
  });

  //   this will be executed when the connection is established
  call.on("open", () => {
    console.log("connection established");

    console.log(video);

    
  });

  //   to recieve the data from the other peer
  call.on("data", (data) => {
    console.log("Received data", data);
  });
});

// to recieve the connection
peer.on("connection", (conn) => {
  console.log("first user connected to second user");
  console.log(conn);

  const msg = document.getElementById("msg");
  const send = document.getElementById("send");

  //   to send the message to the other peer
  send.addEventListener("click", () => {
    const msgvalue = msg.value;
    console.log(msgvalue);
    conn.send(msgvalue);
    console.log("message sent");
  });

  //   to recieve the data from the other peer
  conn.on("data", (data) => {
    conn.send("i am in the reciever side");
    console.log("Received the data", data);
  });
});

// to handle the error if there is any error during the connection
peer.on("error", function (err) {
  console.log(err);
  console.log("there is some error");
});

// to recieve the video stream from the other peer
peer.on("call", (call) => {
  console.log("video call is about to start");
  call.answer(localVideoStream); // Answer the call with an A/V stream.
  call.on('stream', function(remoteStream) {
    console.log("adding remote stream in the remotestream video element ")
   const rv = document.getElementById('remotestream');
    rv.srcObject = remoteStream;
    rv.addEventListener('loadedmetadata', () => {
      rv.play();
    })
  });

});
