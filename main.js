var firebaseConfig = {
    apiKey: "AIzaSyDm4f-A_QAUUF48XQiPRAN8qsms6u0wPPM",
    authDomain: "server-11f39.firebaseapp.com",
    projectId: "server-11f39",
    storageBucket: "server-11f39.appspot.com",
    messagingSenderId: "434483691038",
    appId: "1:434483691038:web:4ad3b0d0608de777d5b80f",
    measurementId: "G-1DNXFY89BJ"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      document.body.classList.add("logged-in");
      afterLogin();
    } else {
      document.body.classList.remove("logged-in");
    }
  });
  
  function afterLogin() {
    loadApps();
    initAppSettings();
  }
  
  function signIn() {
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = "next_page.html";
      })
      .catch((error) => {
        console.error("Ошибка входа:", error);
        alert("Ошибка входа: " + error.message);
      });
  }
  function hideSettings() {
    document.querySelector(".app-settings").setAttribute("hidden", "");
}
  
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    signIn();
  });

  document.getElementById("logout-btn").addEventListener("click", function() {
    // Открыть модальное окно подтверждения выхода
    var logoutModal = document.getElementById("logoutModal");
    logoutModal.style.display = "block";
  });
  
  document.getElementById("cancelLogout").addEventListener("click", function() {
    // Закрыть модальное окно подтверждения выхода
    var logoutModal = document.getElementById("logoutModal");
    logoutModal.style.display = "none";
  });
  
  document.getElementById("confirmLogout").addEventListener("click", function() {
    firebase.auth().signOut().then(() => {
      // Вернуть пользователя на страницу входа и заменить текущий элемент истории
      window.location.replace("index.html");
    }).catch((error) => {
      // Обработать ошибки выхода
      console.error("Ошибка выхода: ", error);
    });
  });
  
      
  
  
  
  function createApp() {
    const appName = document.getElementById("appName").value;
  
    if (!appName) {
      alert("Пожалуйста, введите название приложения.");
      return;
    }
  
    firebase.database().ref("applications/" + appName).once("value", (snapshot) => {
      if (snapshot.exists()) {
        alert("Приложение с таким названием уже существует.");
        return;
      }
  
      firebase.database().ref("applications/" + appName).set({
        countries: "",
        isEnabled: false,
        link: "",
        oneSignal: "",
        apps: "",
      }).then(() => {
        alert("Приложение успешно создано.");
        document.getElementById("appName").value = "";
      }).catch((error) => {
        console.error("Error creating application:", error);
        alert("Error creating application: " + error.message);
      });
    });
  }
  
  
  function loadApps() {
    firebase.database().ref("applications").on("value", (snapshot) => {
      const apps = snapshot.val();
      const appContainer = document.getElementById("apps");
      appContainer.innerHTML = "";
  
      for (let appName in apps) {
        const appItem = document.createElement("button");
        appItem.textContent = appName;
        appItem.className = "app-button";
        appItem.onclick = () => loadAppSettings(appName);
        appContainer.appendChild(appItem);
  
        appItem.addEventListener("click", () => {
          const selectedApp = document.querySelector("#apps button.selected");
          if (selectedApp) {
            selectedApp.classList.remove("selected");
          }
          appItem.classList.add("selected");
          loadAppSettings(appName);
        });
      }
    });
  }
  
  function loadAppSettings(appName) {
    firebase.database().ref("applications/" + appName).once("value", (snapshot) => {
      const settings = snapshot.val();
      document.getElementById("countries").value = settings.countries || "";
      document.getElementById("isEnabled").checked = settings.isEnabled || false;
      document.getElementById("link").value = settings.link || "";
      document.getElementById("oneSignal").value = settings.oneSignal || "";
      document.getElementById("appIDs").value = settings.apps || "";
      showSettings();
  });
}
  

function saveSettings() {
  const selectedAppButton = document.querySelector("#apps button.selected");
  if (!selectedAppButton) {
    alert("Пожалуйста, выберите приложение.");
    return;
  }

  const appName = selectedAppButton.textContent;
  const countries = document.getElementById("countries").value;
  const isEnabled = document.getElementById("isEnabled").checked;
  const link = document.getElementById("link").value;
  const oneSignal = document.getElementById("oneSignal").value;
  const apps = document.getElementById("appIDs").value;

  const settings = {
    countries,
    isEnabled,
    link,
    oneSignal,
    apps,
  };

  

  firebase.database().ref("applications/" + appName).update(settings)
    .then(() => {
      alert("Настройки успешно сохранены.");
      selectedAppButton.classList.remove("selected");
      hideSettings(); // вызов функции скрытия раздела настроек
    }).catch((error) => {
      console.error("Ошибка сохранения настроек:", error);
      alert("Ошибка сохранения настроек: " + error.message);
    });
}

if (document.querySelector(".app-settings")) {
  loadApps();

  document.querySelector("#createAppForm form").addEventListener("submit", (e) => {
    e.preventDefault();
    createApp();
  });

  document.querySelector(".app-settings form").addEventListener("submit", (e) => {
    e.preventDefault();
    saveSettings();
  });
}

function toggleCreateAppForm() {
  const createAppForm = document.getElementById("createAppForm");
  const isHidden = createAppForm.hasAttribute("hidden");
  if (isHidden) {
    createAppForm.removeAttribute("hidden");
  } else {
    createAppForm.setAttribute("hidden", "");
  }
}

document.getElementById("createAppBtn").addEventListener("click", (e) => {
  e.preventDefault();
  toggleCreateAppForm();

});

loadApps();

function showSettings() {
  document.querySelector(".app-settings").removeAttribute("hidden");
}

function initAppSettings() {
  document.querySelector(".app-settings").setAttribute("hidden", "");
}
