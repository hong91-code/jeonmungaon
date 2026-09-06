/* =========================================================
   전문가ON Firebase Messaging Service Worker - FINAL
   한 메시지당 알림 1개만 표시
========================================================= */


importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js"
);


importScripts(
  "https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js"
);


/* =========================================================
   Firebase
========================================================= */

firebase.initializeApp({

  apiKey:
    "AIzaSyBnX4SFPAUq8uec1TnUxsACi-8UO0lf8_Y",

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
   백그라운드 Push

   Edge Function은 DATA ONLY로 전송하므로
   실제 알림은 여기서 딱 1번 생성합니다.
========================================================= */

messaging.onBackgroundMessage(
  (payload) => {


    console.log(
      "[전문가ON] PUSH 수신:",
      payload
    );


    const data =
      payload?.data || {};


    const title =
      data.title ||
      "전문가ON";


    const body =
      data.body ||
      "새로운 알림이 도착했습니다.";


    const targetUrl =
      data.url ||
      "https://hong91-code.github.io/jeonmungaon/";


    /*
     * 동일 상담 + 동일 이벤트는
     * 같은 tag 사용
     *
     * 혹시 같은 메시지가 두 번 호출돼도
     * 알림 두 개가 쌓이지 않고 교체됩니다.
     */

    const tag =
      data.tag ||
      (
        "jeonmungaon-" +
        (
          data.type ||
          "notification"
        ) +
        "-" +
        (
          data.consult_id ||
          "general"
        )
      );


    const options = {

      body,

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


      tag,


      renotify:
        false,


      data: {

        url:
          targetUrl,

        type:
          data.type || "",

        consult_id:
          data.consult_id || ""

      }

    };


    return self.registration
      .showNotification(
        title,
        options
      );

  }
);


/* =========================================================
   알림 클릭
========================================================= */

self.addEventListener(
  "notificationclick",
  (event) => {


    event.notification.close();


    const targetUrl =
      event.notification
        ?.data
        ?.url

      ||

      "https://hong91-code.github.io/jeonmungaon/";


    event.waitUntil(

      clients
        .matchAll({

          type:
            "window",

          includeUncontrolled:
            true

        })

        .then(

          async (
            clientList
          ) => {


            /*
             * 이미 전문가ON 창이 열려 있으면
             * 새 창을 만들지 않고 해당 창으로 이동
             */

            for (
              const client
              of clientList
            ) {

              try {

                const url =
                  new URL(
                    client.url
                  );


                if (
                  url.hostname ===
                  "hong91-code.github.io"
                ) {

                  if (
                    "navigate" in client
                  ) {

                    await client.navigate(
                      targetUrl
                    );

                  }


                  if (
                    "focus" in client
                  ) {

                    return client.focus();

                  }

                }

              }

              catch (_) {

              }

            }


            /*
             * 열려 있는 창이 없으면 새 창
             */

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
