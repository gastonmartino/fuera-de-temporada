(function () {
  "use strict";
  var experience = document.getElementById("experience");
  var splash = document.getElementById("splash");
  var begin = document.getElementById("begin");
  var reset = document.getElementById("reset");
  var typography = document.querySelector(".poster-typography");
  var cycleTimer;
  var impactTimer;
  var shakeTimer;
  var audioContext;

  function sound() {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      audioContext = audioContext || new AudioCtx();
      if (audioContext.resume) audioContext.resume();
      var now = audioContext.currentTime;
      var osc = audioContext.createOscillator();
      var gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(125, now);
      osc.frequency.exponentialRampToValueAtTime(76, now + 0.5);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(now); osc.stop(now + 0.58);
    } catch (ignore) {}
  }

  function beginSplashCycle() {
    typography.className = "poster-typography text-enter";
    cycleTimer = window.setTimeout(attention, 4200);
  }

  function attention() {
    splash.className = "screen screen-splash attention";
    window.setTimeout(function () {
      splash.className = "screen screen-splash";
      window.setTimeout(function () {
        typography.className = "poster-typography text-exit";
        cycleTimer = window.setTimeout(beginSplashCycle, 1700);
      }, 800);
    }, 4800);
  }

  function startExperience() {
    if (experience.className.indexOf("state-splash") === -1) return;
    sound();
    experience.className = "experience state-impact";
    var frames = ["translate(0,0)", "translate(-8px,3px)", "translate(7px,-4px)", "translate(-5px,-2px)", "translate(4px,2px)"];
    var frame = 0;
    shakeTimer = window.setInterval(function () {
      experience.style.transform = frames[frame % frames.length];
      frame += 1;
    }, 55);
    impactTimer = window.setTimeout(function () {
      window.clearInterval(shakeTimer);
      experience.style.transform = "";
      experience.className = "experience state-report";
    }, 3300);
  }

  function resetExperience() {
    window.clearTimeout(impactTimer);
    window.clearInterval(shakeTimer);
    experience.style.transform = "";
    experience.className = "experience state-splash";
    beginSplashCycle();
  }

  begin.addEventListener("click", startExperience, false);
  splash.addEventListener("click", function (event) { if (event.target !== begin) startExperience(); }, false);
  splash.addEventListener("touchstart", function (event) { if (event.target !== begin) startExperience(); }, false);
  reset.addEventListener("click", function (event) {
    event.preventDefault();
    resetExperience();
  }, false);
  document.getElementById("stat-title").addEventListener("click", resetExperience, false);
  beginSplashCycle();
}());
