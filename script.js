export default function init({ THREE, GLTFLoader, OrbitControls }) {
  const API_KEY = "37RIquf2q090PhzkSrEvNwKfGaNDvNUa5JjLa3IQFI0FSDEpJ39ihmCtL0WM7WE9I4INyqVH%2BIMLTRDJl2%2FsOg%3D%3D";

  const areas = [
    { name: "제주도 제주시", areaCode: 39, sigunguCode: 4, type: "sea" },
    { name: "제주도 서귀포시", areaCode: 39, sigunguCode: 3, type: "sea" },
    { name: "전남 고흥군", areaCode: 38, sigunguCode: 2, type: "sea" },
    { name: "전남 나주시", areaCode: 38, sigunguCode: 6, type: "forest" },
    { name: "전남 목포시", areaCode: 38, sigunguCode: 8, type: "sea" },
    { name: "전남 무안군", areaCode: 38, sigunguCode: 9, type: "sea" },
    { name: "전남 여수시", areaCode: 38, sigunguCode: 13, type: "sea" },
    { name: "전북 무주군", areaCode: 37, sigunguCode: 5, type: "forest" },
    { name: "전북 전주시", areaCode: 37, sigunguCode: 12, type: "city" },
    { name: "전북 군산시", areaCode: 37, sigunguCode: 2, type: "sea" },
    { name: "경남 거제시", areaCode: 36, sigunguCode: 1, type: "sea" },
    { name: "경남 김해시", areaCode: 36, sigunguCode: 4, type: "city" },
    { name: "경남 남해군", areaCode: 36, sigunguCode: 5, type: "sea" },
    { name: "경남 마산시", areaCode: 36, sigunguCode: 6, type: "city" },
    { name: "경남 밀양시", areaCode: 36, sigunguCode: 7, type: "forest" },
    { name: "경남 통영시", areaCode: 36, sigunguCode: 17, type: "sea" },
    { name: "경북 경주시", areaCode: 35, sigunguCode: 2, type: "city" },
    { name: "경북 안동시", areaCode: 35, sigunguCode: 11, type: "forest" },
    { name: "경북 울릉군", areaCode: 35, sigunguCode: 17, type: "sea" },
    { name: "경북 포항시", areaCode: 35, sigunguCode: 23, type: "sea" },
    { name: "충남 천안시", areaCode: 34, sigunguCode: 12, type: "city" },
    { name: "충북 청주시", areaCode: 33, sigunguCode: 10, type: "city" },
    { name: "강원 강릉시", areaCode: 32, sigunguCode: 1, type: "sea" },
    { name: "강원 삼척시", areaCode: 32, sigunguCode: 4, type: "sea" },
    { name: "강원 속초시", areaCode: 32, sigunguCode: 5, type: "sea" },
    { name: "강원 양양군", areaCode: 32, sigunguCode: 7, type: "sea" },
    { name: "강원 춘천시", areaCode: 32, sigunguCode: 13, type: "forest" },
    { name: "경기 가평군", areaCode: 31, sigunguCode: 1, type: "forest" },
    { name: "경기 광명시", areaCode: 31, sigunguCode: 4, type: "city" },
    { name: "경기 김포시", areaCode: 31, sigunguCode: 8, type: "city" },
    { name: "경기 남양주시", areaCode: 31, sigunguCode: 9, type: "forest" },
    { name: "경기 성남시", areaCode: 31, sigunguCode: 12, type: "city" },
    { name: "경기 수원시", areaCode: 31, sigunguCode: 13, type: "city" },
    { name: "경기 양평군", areaCode: 31, sigunguCode: 19, type: "forest" },
    { name: "경기 용인시", areaCode: 31, sigunguCode: 23, type: "city" },
    { name: "경기 파주시", areaCode: 31, sigunguCode: 27, type: "city" },
    { name: "부산 기장군", areaCode: 6, sigunguCode: 3, type: "sea" },
    { name: "부산 중구", areaCode: 6, sigunguCode: 15, type: "city" },
    { name: "부산 해운대구", areaCode: 6, sigunguCode: 16, type: "sea" },
    { name: "인천 강화군", areaCode: 2, sigunguCode: 1, type: "sea" },
    { name: "인천 부평구", areaCode: 2, sigunguCode: 6, type: "city" },
    { name: "인천 중구", areaCode: 2, sigunguCode: 10, type: "sea" }
  ];

  const themeMap = {
    Green: ["forest", "sea"],
    Purple: ["city"],
    Pink: ["city"],
    Blue: ["sea", "forest"],
    Yellow: ["forest", "city"],
  };

  let currentTrain = null;
  let currentBgType = null;
  let currentTrainColor = null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  scene.add(new THREE.AmbientLight(0x404040));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  const loader = new GLTFLoader();
  const textureLoader = new THREE.TextureLoader();

  const recommendBtn = document.getElementById('recommend-button');
  const overlay = document.getElementById('recommend-overlay');
  const uiContainer = document.getElementById('ui-container');
  const recommendBox = document.getElementById('recommendation');
  const regionName = document.getElementById('region-name');

  function loadTrain(color) {
    const path = `Train_${color}.glb`;
    currentTrainColor = color;
    if (currentTrain) scene.remove(currentTrain);
    loader.load(path, gltf => {
      currentTrain = gltf.scene;
      currentTrain.position.set(0, 0, 0);
      currentTrain.scale.set(1, 1, 1);
      scene.add(currentTrain);
    });
  }

  function setBackground(img) {
    textureLoader.load(img, texture => scene.background = texture);
  }

  setBackground("철도.jpg");
  loadTrain("White");

  document.querySelectorAll('#buttons button').forEach(btn => {
    btn.onclick = () => loadTrain(btn.dataset.color);
  });

  document.querySelectorAll('#bg-buttons button').forEach(btn => {
    btn.onclick = () => {
      setBackground(btn.dataset.bg);
      if (btn.dataset.bg.includes("바다")) currentBgType = "sea";
      else if (btn.dataset.bg.includes("숲")) currentBgType = "forest";
      else if (btn.dataset.bg.includes("도시")) currentBgType = "city";
      else currentBgType = null;
    };
  });

  recommendBtn.addEventListener('click', () => {
    if (!currentTrain) {
      alert("기차가 아직 로드되지 않았어요!");
      return;
    }

    overlay.style.display = 'block';
    let frame = 0;
    const max = 120;
    const startX = currentTrain.position.x;
    const endX = startX + 10;

    function animateExit() {
      frame++;
      const p = frame / max;
      currentTrain.position.x = startX + (endX - startX) * (p * (2 - p));
      const scale = 1 - p;
      currentTrain.scale.set(scale, scale, scale);
      if (frame < max) requestAnimationFrame(animateExit);
      else {
        overlay.style.display = 'none';
        recommendBtn.style.display = 'none';
        uiContainer.style.display = 'none';
        showRecommendation();
      }
    }

    animateExit();
  });

  function showRecommendation() {
    const themeTypes = themeMap[currentTrainColor] || [];
    const filtered = areas.filter(area => {
      const bgMatch = currentBgType ? area.type === currentBgType : true;
      const themeMatch = themeTypes.length > 0 ? themeTypes.includes(area.type) : true;
      return bgMatch && themeMatch;
    });

    const area = filtered.length > 0
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : areas[Math.floor(Math.random() * areas.length)];

    regionName.textContent = `📍 ${area.name}`;
    regionName.classList.remove('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');

    fetchData(area, 12, 'tour-list');
    fetchData(area, 39, 'food-list');
    fetchData(area, 32, 'stay-list');
    fetchData(area, 38, 'shopping-list');
    fetchData(area, 28, 'leisure-list');

    recommendBox.classList.remove('hidden');
    sessionStorage.setItem("restoreHTML", recommendBox.innerHTML);
    sessionStorage.setItem("lastRecommendation", JSON.stringify(area));
  }

  function fetchData(area, typeId, listId) {
    const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=App&_type=json&contentTypeId=${typeId}&areaCode=${area.areaCode}&sigunguCode=${area.sigunguCode}&numOfRows=6&pageNo=1&arrange=B`;
    fetch(url).then(res => res.json()).then(data => {
      const list = document.getElementById(listId);
      list.innerHTML = "";
      const items = data?.response?.body?.items?.item;
      if (!items?.length) return list.innerHTML = '<li>정보 없음</li>';
      items.forEach(item => {
        const li = document.createElement('li');
        const img = item.firstimage ? `<img src="${item.firstimage}" alt="${item.title}">` : '';
        li.innerHTML = `${img}<strong>${item.title}</strong><br/><small>${item.addr1 || ''}</small>`;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
          showDetailModal(item.contentid, typeId);
        });
        list.appendChild(li);
      });
    });
  }

  function showDetailModal(contentId, contentTypeId) {
    const API = `https://apis.data.go.kr/B551011/KorService1`;
    const key = `&serviceKey=${API_KEY}&MobileOS=ETC&MobileApp=App&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}`;
    const modal = document.getElementById("detail-modal");
    const titleEl = document.getElementById("detail-title");
    const overviewEl = document.getElementById("detail-overview");
    const extraEl = document.getElementById("detail-extra");

    modal.classList.remove("hidden");

    fetch(`${API}/detailCommon1?defaultYN=Y&overviewYN=Y${key}`)
      .then(res => res.json())
      .then(data => {
        const item = data?.response?.body?.items?.item?.[0];
        if (!item) throw new Error("정보 없음");
        titleEl.textContent = item.title || "제목 없음";
        overviewEl.innerHTML = item.overview || "설명 없음";
      });

    fetch(`${API}/detailIntro1?${key}`)
      .then(res => res.json())
      .then(data => {
        const intro = data?.response?.body?.items?.item?.[0];
        if (!intro) return extraEl.innerHTML = '';
        let html = "";
        if (intro.startplace) html += `<p><strong>출발지:</strong> ${intro.startplace}</p>`;
        if (intro.schedule) html += `<p><strong>일정:</strong> ${intro.schedule}</p>`;
        if (intro.distance) html += `<p><strong>거리:</strong> ${intro.distance}</p>`;
        extraEl.innerHTML = html;
      });
  }

  document.getElementById("close-modal").onclick = () => {
    document.getElementById("detail-modal").classList.add("hidden");
  };

  document.getElementById('reset-btn').onclick = () => {
    document.getElementById("region-name").classList.add("hidden");
    document.getElementById("recommendation").classList.add("hidden");
    document.getElementById("reset-btn").classList.add("hidden");
  
    document.getElementById("recommend-button").style.display = "block";
    document.getElementById("ui-container").style.display = "flex";
  
    document.getElementById("tour-list").innerHTML = "";
    document.getElementById("food-list").innerHTML = "";
    document.getElementById("stay-list").innerHTML = "";
    document.getElementById("shopping-list").innerHTML = "";
    document.getElementById("leisure-list").innerHTML = "";
  
    sessionStorage.removeItem("restoreHTML");
    sessionStorage.removeItem("lastRecommendation");

    loadTrain("White");
  };  

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("restore") === "true") {
      const html = sessionStorage.getItem("restoreHTML");
      const areaData = sessionStorage.getItem("lastRecommendation");

      if (html && areaData) {
        const area = JSON.parse(areaData);
        regionName.textContent = `📍 ${area.name || area.areaName}`;
        regionName.classList.remove("hidden");

        recommendBox.innerHTML = html;
        recommendBox.classList.remove("hidden");
        document.getElementById('reset-btn').classList.remove("hidden");
        recommendBtn.style.display = 'none';
        uiContainer.style.display = 'none';
      }
    }
  });
}

document.getElementById('watch-tutorial').onclick = () => {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('tutorial-screen').classList.remove('hidden');
};

document.getElementById('skip-tutorial').onclick = () => {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('main-ui').classList.remove('hidden');
};