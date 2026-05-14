(function () {
  const FILE_SIZES = {
    SHARED: 0x1e4c98,
    JP: 0x14bd68,
    KR: 0x1f0048,
  };

  const SETTINGS = {
    consoleId: 0x18,
    lastSaveDate: 0x10,
    byRegion: {
      EU: { sound: 0x1e4c7e, music: 0x1e4c7b, soundEffects: 0x1e4c7c, voice: 0x1e4c7d },
      US: { sound: 0x1e4c7e, music: 0x1e4c7b, soundEffects: 0x1e4c7c, voice: 0x1e4c7d },
      JP: { sound: 0x14bd4e, music: 0x14bd4b, soundEffects: 0x14bd4c, voice: 0x14bd4d },
      KR: { sound: 0x1f002e, music: 0x1f002b, soundEffects: 0x1f002c, voice: 0x1f002d },
    },
  };

  const ISLAND = {
    byRegion: {
      EU: {
        money: 0x1e4bb8,
        islandName: 0x1e4bcc,
        islandPronunciation: 0x1e4bf6,
        problemsSolved: 0x1e4bc6,
        weddings: 0x1e4bc0,
        childrenBorn: 0x1e4bc2,
        travelersReceived: 0x1e4bbe,
        streetPassEncounters: 0x1e4bbc,
        travelersSent: 0x1e4bc4,
        islandAddress: 0x20,
        itemColor: 0x1e4bea,
        itemSent: 0x1e4be8,
        hasPronunciation: true,
      },
      US: {
        money: 0x1e4bb8,
        islandName: 0x1e4bcc,
        islandPronunciation: 0x1e4bf6,
        problemsSolved: 0x1e4bc6,
        weddings: 0x1e4bc0,
        childrenBorn: 0x1e4bc2,
        travelersReceived: 0x1e4bbe,
        streetPassEncounters: 0x1e4bbc,
        travelersSent: 0x1e4bc4,
        islandAddress: 0x20,
        itemColor: 0x1e4bea,
        itemSent: 0x1e4be8,
        hasPronunciation: true,
      },
      JP: {
        money: 0x14bca8,
        islandName: 0x14bcbc,
        islandPronunciation: 0,
        problemsSolved: 0x14bcb6,
        weddings: 0x14bcb0,
        childrenBorn: 0x14bcb2,
        travelersReceived: 0x14bcae,
        streetPassEncounters: 0x14bcac,
        travelersSent: 0x14bcb4,
        islandAddress: 0x20,
        itemColor: 0x14bcd8,
        itemSent: 0x14bcd6,
        hasPronunciation: false,
      },
      KR: {
        money: 0x1eff68,
        islandName: 0x1eff7c,
        islandPronunciation: 0x1effa6,
        problemsSolved: 0x1eff76,
        weddings: 0x1eff70,
        childrenBorn: 0x1eff72,
        travelersReceived: 0x1eff6e,
        streetPassEncounters: 0x1eff6c,
        travelersSent: 0x1eff74,
        islandAddress: 0x20,
        itemColor: 0x1eff9a,
        itemSent: 0x1eff98,
        hasPronunciation: true,
      },
    },
  };

  const MII = {
    byRegion: {
      EU: { base: 0x1c70, stride: 0x660, nameOffset: 0x1a, dataLength: 0x5e, crcOffset: 0x5e, slots: 100 },
      US: { base: 0x1c70, stride: 0x660, nameOffset: 0x1a, dataLength: 0x5e, crcOffset: 0x5e, slots: 100 },
      KR: { base: 0x1c70, stride: 0x660, nameOffset: 0x1a, dataLength: 0x5e, crcOffset: 0x5e, slots: 100 },
      JP: { base: 0x1c40, stride: 0x590, nameOffset: 0x1a, dataLength: 0x5e, crcOffset: 0x5e, slots: 100 },
    },
  };

  const APARTMENT = {
    byRegion: {
      EU: { base: 0x29ac0, stride: 0x100, slots: 100 },
      US: { base: 0x29ac0, stride: 0x100, slots: 100 },
      KR: { base: 0x29ac0, stride: 0x100, slots: 100 },
      JP: { base: 0x24950, stride: 0x100, slots: 100 },
    },
  };

  const ROOM_MAP = {
    byRegion: {
      EU: { base: 0x22a8, stride: 0x660, slots: 100 },
      US: { base: 0x22a8, stride: 0x660, slots: 100 },
      KR: { base: 0x22a8, stride: 0x660, slots: 100 },
      JP: { base: 0x21a8, stride: 0x590, slots: 100 },
    },
  };

  const state = {
    fileName: "",
    region: "",
    original: null,
    working: null,
    theme: "light",
  };

  const el = {
    fileInput: document.getElementById("fileInput"),
    themeToggle: document.getElementById("themeToggle"),
    regionPrompt: document.getElementById("regionPrompt"),
    metaFile: document.getElementById("metaFile"),
    metaRegion: document.getElementById("metaRegion"),
    metaDirty: document.getElementById("metaDirty"),
    metaSize: document.getElementById("metaSize"),
    downloadEdited: document.getElementById("downloadEdited"),
    downloadBackup: document.getElementById("downloadBackup"),
    restoreOriginal: document.getElementById("restoreOriginal"),
    status: document.getElementById("status"),
    lastSaveDate: document.getElementById("lastSaveDate"),
    consoleId: document.getElementById("consoleId"),
    soundMode: document.getElementById("soundMode"),
    musicLevel: document.getElementById("musicLevel"),
    soundEffectsLevel: document.getElementById("soundEffectsLevel"),
    voiceLevel: document.getElementById("voiceLevel"),
    applySaveSettings: document.getElementById("applySaveSettings"),
    money: document.getElementById("money"),
    islandName: document.getElementById("islandName"),
    pronunciationField: document.getElementById("pronunciationField"),
    islandPronunciation: document.getElementById("islandPronunciation"),
    problemsSolved: document.getElementById("problemsSolved"),
    weddings: document.getElementById("weddings"),
    childrenBorn: document.getElementById("childrenBorn"),
    travelersReceived: document.getElementById("travelersReceived"),
    streetPassEncounters: document.getElementById("streetPassEncounters"),
    travelersSent: document.getElementById("travelersSent"),
    islandAddress: document.getElementById("islandAddress"),
    itemSent: document.getElementById("itemSent"),
    itemColor: document.getElementById("itemColor"),
    applyIslandInfo: document.getElementById("applyIslandInfo"),
    miiSlot: document.getElementById("miiSlot"),
    miiCrc: document.getElementById("miiCrc"),
    repairSelectedMii: document.getElementById("repairSelectedMii"),
    repairAllMiis: document.getElementById("repairAllMiis"),
    apartmentScene: document.getElementById("apartmentScene"),
    apartmentGrid: document.getElementById("apartmentGrid"),
    applyApartments: document.getElementById("applyApartments"),
  };

  function init() {
    loadTheme();
    el.fileInput.addEventListener("change", onFileSelected);
    el.themeToggle.addEventListener("click", toggleTheme);
    document.querySelectorAll('input[name="region"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        state.region = radio.value;
        hydrateEditors();
        setStatus(`Region set to ${state.region}.`);
      });
    });
    el.applySaveSettings.addEventListener("click", applySaveSettings);
    el.applyIslandInfo.addEventListener("click", applyIslandInfo);
    el.downloadEdited.addEventListener("click", () => downloadBytes(state.working, buildEditedFileName()));
    el.downloadBackup.addEventListener("click", () => downloadBytes(state.original, buildBackupFileName()));
    el.restoreOriginal.addEventListener("click", restoreOriginal);
    el.miiSlot.addEventListener("change", refreshSelectedMiiCrc);
    el.repairSelectedMii.addEventListener("click", repairSelectedMii);
    el.repairAllMiis.addEventListener("click", repairAllMiis);
    el.applyApartments.addEventListener("click", applyApartments);
  }

  function loadTheme() {
    const savedTheme = window.localStorage.getItem("tlse-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      state.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      state.theme = "dark";
    }
    applyTheme();
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("tlse-theme", state.theme);
    applyTheme();
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    el.themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    el.themeToggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  }

  async function onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const regionOptions = detectRegionBySize(buffer.length);
    if (regionOptions.length === 0) {
      clearState();
      setStatus("Invalid Tomodachi Life save file size.");
      return;
    }

    state.fileName = file.name;
    state.original = new Uint8Array(buffer);
    state.working = new Uint8Array(buffer);
    state.region = regionOptions.length === 1 ? regionOptions[0] : "";

    el.regionPrompt.classList.toggle("hidden", regionOptions.length === 1);
    resetRegionRadios();
    syncMeta();

    if (regionOptions.length === 1) {
      hydrateEditors();
      setStatus(`Loaded ${file.name}. Save stays in browser memory only.`);
    } else {
      toggleEditorButtons(false);
      setStatus("Pick EUR or USA region to continue.");
    }
  }

  function detectRegionBySize(size) {
    if (size === FILE_SIZES.SHARED) {
      return ["EU", "US"];
    }
    if (size === FILE_SIZES.JP) {
      return ["JP"];
    }
    if (size === FILE_SIZES.KR) {
      return ["KR"];
    }
    return [];
  }

  function hydrateEditors() {
    if (!hasLoadedSave() || !state.region) {
      syncMeta();
      return;
    }

    el.regionPrompt.classList.add("hidden");
    readSaveSettings();
    readIslandInfo();
    populateMiiList();
    renderApartmentGrid();
    refreshSelectedMiiCrc();
    toggleEditorButtons(true);
    syncMeta();
  }

  function readSaveSettings() {
    const cfg = SETTINGS.byRegion[state.region];
    const view = getView();

    el.lastSaveDate.value = readUint32(view, SETTINGS.lastSaveDate);
    el.consoleId.value = readHex(state.working, SETTINGS.consoleId, 8);
    el.soundMode.value = String(readUint8(view, cfg.sound));
    el.musicLevel.value = String(readUint8(view, cfg.music));
    el.soundEffectsLevel.value = String(readUint8(view, cfg.soundEffects));
    el.voiceLevel.value = String(readUint8(view, cfg.voice));
  }

  function applySaveSettings() {
    try {
      const cfg = SETTINGS.byRegion[state.region];
      const view = getView();
      writeUint32(view, SETTINGS.lastSaveDate, parseInteger(el.lastSaveDate.value, 0, 0xffffffff));
      writeFixedHex(state.working, SETTINGS.consoleId, 8, el.consoleId.value);
      writeUint8(view, cfg.sound, parseInteger(el.soundMode.value, 0, 2));
      writeUint8(view, cfg.music, parseInteger(el.musicLevel.value, 0, 3));
      writeUint8(view, cfg.soundEffects, parseInteger(el.soundEffectsLevel.value, 0, 3));
      writeUint8(view, cfg.voice, parseInteger(el.voiceLevel.value, 0, 3));
      syncMeta();
      setStatus("Save file settings patched in memory.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function readIslandInfo() {
    const cfg = ISLAND.byRegion[state.region];
    const view = getView();

    el.money.value = readUint32(view, cfg.money);
    el.islandName.value = readUtf16(state.working, cfg.islandName, 10);
    el.pronunciationField.classList.toggle("hidden", !cfg.hasPronunciation);
    el.islandPronunciation.value = cfg.hasPronunciation ? readUtf16(state.working, cfg.islandPronunciation, 20) : "";
    el.problemsSolved.value = readUint16(view, cfg.problemsSolved);
    el.weddings.value = readUint16(view, cfg.weddings);
    el.childrenBorn.value = readUint16(view, cfg.childrenBorn);
    el.travelersReceived.value = readUint16(view, cfg.travelersReceived);
    el.streetPassEncounters.value = readUint16(view, cfg.streetPassEncounters);
    el.travelersSent.value = readUint16(view, cfg.travelersSent);
    el.islandAddress.value = readHex(state.working, cfg.islandAddress, 16);
    el.itemSent.value = readUint16(view, cfg.itemSent);
    el.itemColor.value = String(readUint8(view, cfg.itemColor));
  }

  function applyIslandInfo() {
    try {
      const cfg = ISLAND.byRegion[state.region];
      const view = getView();

      writeUint32(view, cfg.money, parseInteger(el.money.value, 0, 0xffffffff));
      writeUtf16(state.working, cfg.islandName, 10, el.islandName.value);
      if (cfg.hasPronunciation) {
        writeUtf16(state.working, cfg.islandPronunciation, 20, el.islandPronunciation.value);
      }
      writeUint16(view, cfg.problemsSolved, parseInteger(el.problemsSolved.value, 0, 0xffff));
      writeUint16(view, cfg.weddings, parseInteger(el.weddings.value, 0, 0xffff));
      writeUint16(view, cfg.childrenBorn, parseInteger(el.childrenBorn.value, 0, 0xffff));
      writeUint16(view, cfg.travelersReceived, parseInteger(el.travelersReceived.value, 0, 0xffff));
      writeUint16(view, cfg.streetPassEncounters, parseInteger(el.streetPassEncounters.value, 0, 0xffff));
      writeUint16(view, cfg.travelersSent, parseInteger(el.travelersSent.value, 0, 0xffff));
      writeFixedHex(state.working, cfg.islandAddress, 16, el.islandAddress.value);
      writeUint16(view, cfg.itemSent, parseInteger(el.itemSent.value, 0, 0xffff));
      writeUint8(view, cfg.itemColor, parseInteger(el.itemColor.value, 1, 0xff));

      syncMeta();
      setStatus("Island info patched in memory.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function populateMiiList() {
    const cfg = MII.byRegion[state.region];
    const currentValue = el.miiSlot.value;
    el.miiSlot.innerHTML = "";

    for (let index = 0; index < cfg.slots; index += 1) {
      const slotBase = cfg.base + index * cfg.stride;
      const name = readUtf16(state.working, slotBase + cfg.nameOffset, 10).trim() || "(empty slot)";
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `Mii ${index + 1}: ${name}`;
      el.miiSlot.appendChild(option);
    }

    if (currentValue) {
      el.miiSlot.value = currentValue;
    }
  }

  function refreshSelectedMiiCrc() {
    if (!hasLoadedSave() || !state.region) {
      el.miiCrc.value = "";
      return;
    }
    const slot = Number(el.miiSlot.value || 0);
    const crc = computeMiiCrc(slot);
    el.miiCrc.value = toHex(crc, 4);
  }

  function renderApartmentGrid() {
    const cfg = APARTMENT.byRegion[state.region];
    const miiCfg = MII.byRegion[state.region];
    const roomMap = getRoomAssignments();
    renderApartmentScene(roomMap);
    el.apartmentGrid.innerHTML = "";

    for (let roomIndex = 0; roomIndex < cfg.slots; roomIndex += 1) {
      const roomOffset = cfg.base + roomIndex * cfg.stride;
      const residentSlot = roomMap[roomIndex];
      const miiBase = residentSlot >= 0 ? miiCfg.base + residentSlot * miiCfg.stride : miiCfg.base + roomIndex * miiCfg.stride;
      const roomValue = readUint16(getView(), roomOffset);
      const roomName = residentSlot >= 0 ? readUtf16(state.working, miiBase + miiCfg.nameOffset, 10).trim() || "(empty slot)" : "(empty room)";
      const badge = classifyApartmentValue(roomValue, state.region);

      const card = document.createElement("div");
      card.className = "apartment-card";
      card.innerHTML = `
        <div class="apartment-head">
          <div class="apartment-title">Room ${roomIndex + 1}</div>
          <div class="apartment-badge badge-${badge.tone}">${badge.label}</div>
        </div>
        <div class="apartment-name">${escapeHtml(roomName)}</div>
        <input
          type="number"
          min="0"
          max="65535"
          step="1"
          value="${roomValue}"
          data-apartment-index="${roomIndex}"
        >
      `;
      const input = card.querySelector("input");
      input.addEventListener("input", onApartmentInput);
      el.apartmentGrid.appendChild(card);
    }
  }

  function onApartmentInput(event) {
    const input = event.currentTarget;
    const value = Number(input.value || 0);
    const badge = input.closest(".apartment-card").querySelector(".apartment-badge");
    const info = classifyApartmentValue(value, state.region);
    badge.className = `apartment-badge badge-${info.tone}`;
    badge.textContent = info.label;
  }

  function renderApartmentScene(roomMap) {
    el.apartmentScene.innerHTML = "";
    const apartmentCfg = APARTMENT.byRegion[state.region];
    const miiCfg = MII.byRegion[state.region];

    for (let roomIndex = 0; roomIndex < apartmentCfg.slots; roomIndex += 1) {
      const roomValue = readUint16(getView(), apartmentCfg.base + roomIndex * apartmentCfg.stride);
      const badge = classifyApartmentValue(roomValue, state.region);
      const slot = roomMap[roomIndex];
      const room = document.createElement("div");
      room.className = "room-slot";
      room.dataset.roomIndex = String(roomIndex);
      room.addEventListener("dragover", onRoomDragOver);
      room.addEventListener("dragleave", onRoomDragLeave);
      room.addEventListener("drop", onRoomDrop);

      const label = document.createElement("div");
      label.className = "room-label";
      label.textContent = `Room ${roomIndex + 1}`;
      room.appendChild(label);

      const status = document.createElement("div");
      status.className = `apartment-badge apartment-badge room-status badge-${badge.tone}`;
      status.textContent = badge.label;
      room.appendChild(status);

      if (slot >= 0) {
        room.appendChild(buildResidentCard(slot, roomIndex, miiCfg));
      }

      el.apartmentScene.appendChild(room);
    }
  }

  function buildResidentCard(slot, roomIndex, miiCfg) {
    const miiBase = miiCfg.base + slot * miiCfg.stride;
    const name = readUtf16(state.working, miiBase + miiCfg.nameOffset, 10).trim() || `(Mii ${slot + 1})`;
    const card = document.createElement("div");
    card.className = "resident-card";
    card.draggable = true;
    card.dataset.slotIndex = String(slot);
    card.dataset.roomIndex = String(roomIndex);
    card.addEventListener("dragstart", onResidentDragStart);
    card.addEventListener("dragend", onResidentDragEnd);

    const floor = document.createElement("img");
    floor.className = "resident-floor";
    floor.alt = "";
    floor.src = apartmentFloorAsset(roomIndex);
    card.appendChild(floor);

    const title = document.createElement("div");
    title.className = "resident-name";
    title.textContent = name;
    card.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "resident-meta";
    meta.textContent = `Mii ${slot + 1}`;
    card.appendChild(meta);

    return card;
  }

  function apartmentFloorAsset(roomIndex) {
    const floorBand = Math.min(3, Math.floor(roomIndex / 25));
    return `../Tomodachi Life Save Editor/Resources/icon_appart_0${floorBand}.png`;
  }

  function getRoomAssignments() {
    const cfg = ROOM_MAP.byRegion[state.region];
    const view = getView();
    const byRoom = new Array(cfg.slots).fill(-1);
    for (let slot = 0; slot < cfg.slots; slot += 1) {
      const roomIndex = readUint8(view, cfg.base + slot * cfg.stride);
      if (roomIndex >= 0 && roomIndex < cfg.slots) {
        byRoom[roomIndex] = slot;
      }
    }
    return byRoom;
  }

  function onResidentDragStart(event) {
    const card = event.currentTarget;
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", JSON.stringify({
      slotIndex: Number(card.dataset.slotIndex),
      roomIndex: Number(card.dataset.roomIndex),
    }));
  }

  function onResidentDragEnd(event) {
    event.currentTarget.classList.remove("dragging");
    el.apartmentScene.querySelectorAll(".room-slot").forEach((slot) => {
      slot.classList.remove("drag-over");
    });
  }

  function onRoomDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
  }

  function onRoomDragLeave(event) {
    event.currentTarget.classList.remove("drag-over");
  }

  function onRoomDrop(event) {
    event.preventDefault();
    const targetRoomIndex = Number(event.currentTarget.dataset.roomIndex);
    event.currentTarget.classList.remove("drag-over");
    const payload = JSON.parse(event.dataTransfer.getData("text/plain"));
    swapResidentRooms(payload.slotIndex, payload.roomIndex, targetRoomIndex);
  }

  function swapResidentRooms(sourceSlotIndex, sourceRoomIndex, targetRoomIndex) {
    if (sourceRoomIndex === targetRoomIndex) {
      return;
    }

    const assignments = getRoomAssignments();
    const targetSlotIndex = assignments[targetRoomIndex];
    const roomCfg = ROOM_MAP.byRegion[state.region];
    const view = getView();
    writeUint8(view, roomCfg.base + sourceSlotIndex * roomCfg.stride, targetRoomIndex);
    if (targetSlotIndex >= 0) {
      writeUint8(view, roomCfg.base + targetSlotIndex * roomCfg.stride, sourceRoomIndex);
    }
    syncMeta();
    renderApartmentGrid();
    setStatus(`Swapped room ${sourceRoomIndex + 1} with room ${targetRoomIndex + 1}.`);
  }

  function applyApartments() {
    try {
      const cfg = APARTMENT.byRegion[state.region];
      const view = getView();
      const inputs = el.apartmentGrid.querySelectorAll("input[data-apartment-index]");
      inputs.forEach((input) => {
        const roomIndex = Number(input.dataset.apartmentIndex);
        const value = parseInteger(input.value, 0, 0xffff);
        writeUint16(view, cfg.base + roomIndex * cfg.stride, value);
      });
      syncMeta();
      renderApartmentGrid();
      setStatus("Mii apartment values patched in memory.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function classifyApartmentValue(value, region) {
    if (
      inRange(value, 0x100, 0x148) ||
      inRange(value, 0x167, 0x16f) ||
      inRange(value, 0x171, 0x175) ||
      inRange(value, 0x17b, 0x17d) ||
      value === 0x187 ||
      value === 0x188 ||
      inRange(value, 0x18b, 0x18f)
    ) {
      return { tone: "black", label: "Black" };
    }
    if (
      inRange(value, 0x149, 0x14b) ||
      value === 0x14d ||
      value === 0x14e ||
      value === 0x153 ||
      inRange(value, 0x158, 0x15b) ||
      inRange(value, 0x176, 0x17a) ||
      value === 0x170
    ) {
      return { tone: "orange", label: "Orange" };
    }
    if (
      value === 0x14c ||
      inRange(value, 0x14f, 0x151) ||
      value === 0x154 ||
      value === 0x155
    ) {
      return { tone: "pink", label: "Pink" };
    }
    if (value === 0x156 || value === 0x157) {
      return { tone: "phone", label: "Phone" };
    }
    if (inRange(value, 0x15f, 0x166) || value === 0x15d) {
      return { tone: "blue", label: region === "JP" ? "Blue J" : "Blue" };
    }
    if (value === 0x15e) {
      return { tone: "cyan", label: region === "JP" ? "TBlue J" : "TBlue" };
    }
    if (value === 0x0 || value === 0x15c || inRange(value, 0x17e, 0x186)) {
      return { tone: "none", label: "None" };
    }
    return { tone: "unknown", label: "Unknown" };
  }

  function repairSelectedMii() {
    try {
      const slot = Number(el.miiSlot.value || 0);
      writeMiiCrc(slot);
      syncMeta();
      refreshSelectedMiiCrc();
      setStatus(`Repaired CRC for Mii ${slot + 1}.`);
    } catch (error) {
      setStatus(error.message);
    }
  }

  function repairAllMiis() {
    try {
      const cfg = MII.byRegion[state.region];
      for (let slot = 0; slot < cfg.slots; slot += 1) {
        writeMiiCrc(slot);
      }
      syncMeta();
      refreshSelectedMiiCrc();
      setStatus("Repaired CRC for all 100 Mii slots.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function computeMiiCrc(slot) {
    const cfg = MII.byRegion[state.region];
    const start = cfg.base + slot * cfg.stride;
    const data = state.working.slice(start, start + cfg.dataLength);
    return crc16Xmodem(data);
  }

  function writeMiiCrc(slot) {
    const cfg = MII.byRegion[state.region];
    const view = getView();
    const start = cfg.base + slot * cfg.stride;
    const crcOffset = start + cfg.crcOffset;
    view.setUint16(crcOffset, computeMiiCrc(slot), false);
  }

  function crc16Xmodem(bytes) {
    let crc = 0x0000;
    for (const value of bytes) {
      for (let bitIndex = 0; bitIndex < 8; bitIndex += 1) {
        const bit = (value >> (7 - bitIndex)) & 1;
        const c15 = (crc >> 15) & 1;
        crc = (crc << 1) & 0xffff;
        if ((c15 ^ bit) === 1) {
          crc ^= 0x1021;
        }
      }
    }
    return crc & 0xffff;
  }

  function restoreOriginal() {
    if (!hasLoadedSave()) {
      return;
    }
    state.working = new Uint8Array(state.original);
    hydrateEditors();
    setStatus("Working copy reset to original file.");
  }

  function syncMeta() {
    el.metaFile.textContent = state.fileName || "No file";
    el.metaRegion.textContent = state.region || "-";
    el.metaSize.textContent = state.working ? `${state.working.length} bytes` : "-";
    el.metaDirty.textContent = isDirty() ? "Modified" : "Clean";
  }

  function toggleEditorButtons(enabled) {
    [
      el.downloadEdited,
      el.downloadBackup,
      el.restoreOriginal,
      el.applySaveSettings,
      el.applyIslandInfo,
      el.repairSelectedMii,
      el.repairAllMiis,
      el.applyApartments,
    ].forEach((button) => {
      button.disabled = !enabled;
    });
  }

  function hasLoadedSave() {
    return state.original instanceof Uint8Array && state.working instanceof Uint8Array;
  }

  function isDirty() {
    if (!hasLoadedSave()) {
      return false;
    }
    if (state.original.length !== state.working.length) {
      return true;
    }
    for (let index = 0; index < state.original.length; index += 1) {
      if (state.original[index] !== state.working[index]) {
        return true;
      }
    }
    return false;
  }

  function getView() {
    return new DataView(state.working.buffer, state.working.byteOffset, state.working.byteLength);
  }

  function readUint8(view, offset) {
    return view.getUint8(offset);
  }

  function readUint16(view, offset) {
    return view.getUint16(offset, true);
  }

  function readUint32(view, offset) {
    return view.getUint32(offset, true);
  }

  function writeUint8(view, offset, value) {
    view.setUint8(offset, value);
  }

  function writeUint16(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function writeUint32(view, offset, value) {
    view.setUint32(offset, value, true);
  }

  function readHex(bytes, offset, length) {
    return Array.from(bytes.slice(offset, offset + length), (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function writeFixedHex(bytes, offset, length, input) {
    const normalized = normalizeHex(input);
    if (normalized.length !== length * 2) {
      throw new Error(`Hex value must be ${length * 2} characters.`);
    }
    for (let index = 0; index < length; index += 1) {
      bytes[offset + index] = Number.parseInt(normalized.slice(index * 2, index * 2 + 2), 16);
    }
  }

  function readUtf16(bytes, offset, maxChars) {
    let result = "";
    for (let index = 0; index < maxChars; index += 1) {
      const charCode = bytes[offset + index * 2] | (bytes[offset + index * 2 + 1] << 8);
      if (charCode === 0) {
        break;
      }
      result += String.fromCharCode(charCode);
    }
    return result;
  }

  function writeUtf16(bytes, offset, maxChars, value) {
    const trimmed = value.slice(0, maxChars);
    for (let index = 0; index < maxChars * 2; index += 1) {
      bytes[offset + index] = 0;
    }
    for (let index = 0; index < trimmed.length; index += 1) {
      const charCode = trimmed.charCodeAt(index);
      bytes[offset + index * 2] = charCode & 0xff;
      bytes[offset + index * 2 + 1] = charCode >> 8;
    }
  }

  function parseInteger(raw, min, max) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value < min || value > max) {
      throw new Error(`Value must be integer between ${min} and ${max}.`);
    }
    return value;
  }

  function inRange(value, min, max) {
    return value >= min && value <= max;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function normalizeHex(value) {
    const normalized = String(value).replace(/[^0-9a-f]/gi, "").toUpperCase();
    if (normalized.length === 0) {
      throw new Error("Hex value required.");
    }
    return normalized;
  }

  function toHex(value, width) {
    return value.toString(16).toUpperCase().padStart(width, "0");
  }

  function buildEditedFileName() {
    return appendSuffix(state.fileName || "savedataArc.txt", "_web_edited");
  }

  function buildBackupFileName() {
    return appendSuffix(state.fileName || "savedataArc.txt", "_backup");
  }

  function appendSuffix(name, suffix) {
    const lastDot = name.lastIndexOf(".");
    if (lastDot === -1) {
      return `${name}${suffix}`;
    }
    return `${name.slice(0, lastDot)}${suffix}${name.slice(lastDot)}`;
  }

  function downloadBytes(bytes, fileName) {
    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetRegionRadios() {
    document.querySelectorAll('input[name="region"]').forEach((radio) => {
      radio.checked = false;
    });
  }

  function clearState() {
    state.fileName = "";
    state.region = "";
    state.original = null;
    state.working = null;
    el.regionPrompt.classList.add("hidden");
    toggleEditorButtons(false);
    syncMeta();
  }

  function setStatus(message) {
    el.status.textContent = message;
  }

  init();
}());
