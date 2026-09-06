/* =========================================================
   전문가ON Firebase Messaging Service Worker
   백그라운드 푸시 알림 표시
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
  apiKey: "AIzaSyBnX4SFPAUq8uec1TnUxsACi-8UO0lf8_Y",
  authDomain: "jeonmungaon.firebaseapp.com",
  projectId: "jeonmungaon",
  storageBucket: "jeonmungaon.firebasestorage.app",
  messagingSenderId: "1093664819027",
  appId: "1:1093664819027:web:33ead50b454cbbeb9383a6"
});


const messaging = firebase.messaging();


/* =========================================================
   Firebase 백그라운드 메시지 수신
========================================================= */

messaging.onBackgroundMessage((payload) => {

  console.log(
    "[전문가ON] 백그라운드 메시지 수신:",
    payload
  );


  const data =
    payload?.data || {};


  const notification =
    payload?.notification || {};


  const title =
    notification.title ||
    data.title ||
    "전문가ON";


  const body =
    notification.body ||
    data.body ||
    "새로운 알림이 도착했습니다.";


  const targetUrl =
    data.url ||
    "https://hong91-code.github.io/jeonmungaon/";


  const options = {

    body: body,

    icon:
      "https://hong91-code.github.io/jeonmungaon/icon-192.png",

    badge:
      "https://hong91-code.github.io/jeonmungaon/icon-192.png",

    vibrate: [
      200,
      100,
      200
    ],

    requireInteraction:
      true,

    tag:
      data.type ||
      "jeonmungaon-notification",

    renotify:
      true,

    data: {

      url:
        targetUrl,

      type:
        data.type || "",

      consult_id:
        data.consult_id || ""

    }

  };


  return self.registration.showNotification(
    title,
    options
  );

});


/* =========================================================
   알림 클릭
========================================================= */

self.addEventListener(
  "notificationclick",
  (event) => {

    console.log(
      "[전문가ON] 알림 클릭"
    );


    event.notification.close();


    const targetUrl =
      event.notification?.data?.url ||
      "https://hong91-code.github.io/jeonmungaon/";


    event.waitUntil(

      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(
          (clientList) => {

            for (
              const client
              of clientList
            ) {

              if (
                "focus" in client
              ) {

                try {

                  client.navigate(
                    targetUrl
                  );

                } catch (_) {
                }


                return client.focus();

              }

            }


            if (
              clients.openWindow
            ) {

              return clients.openWindow(
                targetUrl
              );

            }

          }
        )

    );

  }
);


/* =========================================================
   설치
========================================================= */

self.addEventListener(
  "install",
  () => {

    console.log(
      "[전문가ON] Service Worker 설치"
    );

    self.skipWaiting();

  }
);


/* =========================================================
   활성화
========================================================= */

self.addEventListener(
  "activate",
  (event) => {

    console.log(
      "[전문가ON] Service Worker 활성화"
    );


    event.waitUntil(
      self.clients.claim()
    );

  }
);
