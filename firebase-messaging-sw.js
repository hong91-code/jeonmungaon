/* =========================================================
   전문가ON Firebase Messaging Service Worker
========================================================= */

importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);


/* =========================================================
   Firebase 설정
========================================================= */

firebase.initializeApp({

  apiKey:
  "AIzaSyBnX4SFPAUq8uec1TnUxsACi-8UOOlf8_Y",

  authDomain:
  "jeonmungaon.firebaseapp.com",

  projectId:
  "jeonmungaon",

  storageBucket:
  "jeonmungaon.firebasestorage.app",

  messagingSenderId:
  "1093664819027",

  appId:
  "1:1093664819027:web:33ead50b454cbbeb9383a6"

});


const messaging =
firebase.messaging();


/* =========================================================
   백그라운드 PUSH 수신
========================================================= */

messaging.onBackgroundMessage(
(payload)=>{


  console.log(
    "[전문가ON] 백그라운드 PUSH 수신:",
    payload
  );


  const title =
  payload.notification?.title
  ||
  payload.data?.title
  ||
  "전문가ON";


  const body =
  payload.notification?.body
  ||
  payload.data?.body
  ||
  "새로운 알림이 도착했습니다.";


  const targetUrl =
  payload.data?.url
  ||
  "./";


  const notificationOptions = {

    body:
    body,

    icon:
    "./icon-192.png",

    badge:
    "./icon-192.png",

    tag:
    payload.data?.type
    ||
    "jeonmungaon",

    renotify:
    true,

    data:{
      url:
      targetUrl
    }

  };


  return self.registration
  .showNotification(
    title,
    notificationOptions
  );


}
);


/* =========================================================
   PUSH 알림 클릭
========================================================= */

self.addEventListener(
"notificationclick",
(event)=>{


  event.notification
  .close();


  const targetUrl =
  event.notification
  .data
  ?.url
  ||
  "./";


  event.waitUntil(

    clients
    .matchAll({

      type:
      "window",

      includeUncontrolled:
      true

    })
    .then(
    windowClients=>{


      for(
        const client
        of
        windowClients
      ){

        if(
          "focus"
          in
          client
        ){

          client.navigate(
            targetUrl
          );

          return client.focus();

        }

      }


      if(
        clients.openWindow
      ){

        return clients.openWindow(
          targetUrl
        );

      }


    })

  );


}
);
