// ba-click-fx 面板控制脚本
// 依赖：ba-click-fx.iife.js 已加载（BAClickFX 全局可用）

(function() {
  if (!window.BAClickFX) return;

  // ── 默认配置 ──
  var DEFAULTS = {
    color: '#ff5252',       // 主题色：与博客主题统一
    trail: true,            // 启用拖尾
    trailAlways: true,      // 始终显示拖尾
    clickFx: true,          // 点击特效
  };

  // ── 辅助函数 ──
  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function(c) {
      return ('0' + c.toString(16)).slice(-2);
    }).join('');
  }

  // ── 读取保存的设置 ──
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('ba-fx-panel') || '{}');
  } catch(e) {}

  var initColor = hexToRgb(saved.color || DEFAULTS.color);
  var initTrail = saved.trail != null ? saved.trail : DEFAULTS.trail;
  var initTrailAlways = saved.trailAlways != null ? saved.trailAlways : DEFAULTS.trailAlways;
  var initClickFx = saved.clickFx != null ? saved.clickFx : DEFAULTS.clickFx;

  // ── 初始化特效 ──
  // v1.0.11 构造函数中 setter 在 _animationLoopBound 之前，全部移到实例创建后
  window.__baClickFX = new BAClickFX.BAClickFX();
  window.__baClickFX.setColor(initColor[0], initColor[1], initColor[2]);
  window.__baClickFX.setScale(1.10);
  window.__baClickFX.setOpacity(0.50);
  window.__baClickFX.setTrail(initTrail);
  window.__baClickFX.setTrailAlways(initTrailAlways);
  window.__baClickFX.setClick(initClickFx);

  // ── 保存设置 ──
  function saveSettings() {
    var data = {
      color: rgbToHex.apply(null, __baClickFX.getConfig().color),
      trail: __baClickFX.getConfig().trail.enabled,
      trailAlways: __baClickFX.getConfig().trail.always,
      clickFx: initClickFx,
    };
    localStorage.setItem('ba-fx-panel', JSON.stringify(data));
  }

  // ── 注入齿轮按钮和面板 HTML ──
  var gearBtn = document.createElement('a');
  gearBtn.id = 'ba-fx-toggle';
  gearBtn.title = '鼠标特效';
  gearBtn.innerHTML = '<svg viewBox="0 0 512 512" width="16" height="16" fill="currentColor" style="display:block;pointer-events:none"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.7 17.7c-8.8 2.8-18.6 .4-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.4 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';
  document.body.appendChild(gearBtn);

  // 按钮 1:1 跟随背景上移 → 停在距顶部一段距离 → 继续滚动后隐藏
  var GEAR_INITIAL_TOP = 70;   // 初始位置
  var GEAR_STOP_TOP = 13;        // 停止位置（距视口顶部）
  var GEAR_HIDE_SCROLL = 250;   // 隐藏阈值（滚动超过此值隐藏）
  function onScroll() {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var newTop = GEAR_INITIAL_TOP - scrollY;
    if (newTop > GEAR_INITIAL_TOP) { newTop = GEAR_INITIAL_TOP; }
    if (newTop < GEAR_STOP_TOP) { newTop = GEAR_STOP_TOP; }
    gearBtn.style.top = newTop + 'px';
    if (scrollY > GEAR_HIDE_SCROLL) {
      gearBtn.classList.add('hidden');
    } else {
      gearBtn.classList.remove('hidden');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var panelHTML = '<div id="ba-fx-panel">' +
      '<div id="ba-fx-panel-header">' +
        '<span>特效设置</span>' +
        '<button id="ba-fx-panel-close">✕</button>' +
      '</div>' +
      '<label class="ba-fx-ctrl">' +
        '<span>主题颜色</span>' +
        '<input type="color" id="ba-fx-color" value="' + (saved.color || DEFAULTS.color) + '">' +
      '</label>' +
      '<label class="ba-fx-ctrl ba-fx-toggle">' +
        '<span>点击特效</span>' +
        '<input type="checkbox" id="ba-fx-click"' + (initClickFx ? ' checked' : '') + '>' +
        '<span class="ba-fx-toggle-track"></span>' +
      '</label>' +
      '<label class="ba-fx-ctrl ba-fx-toggle">' +
        '<span>启用拖尾</span>' +
        '<input type="checkbox" id="ba-fx-trail"' + (initTrail ? ' checked' : '') + '>' +
        '<span class="ba-fx-toggle-track"></span>' +
      '</label>' +
      '<label class="ba-fx-ctrl ba-fx-toggle">' +
        '<span>始终显示</span>' +
        '<input type="checkbox" id="ba-fx-trail-always"' + (initTrailAlways ? ' checked' : '') + '>' +
        '<span class="ba-fx-toggle-track"></span>' +
      '</label>' +
      '<button id="ba-fx-reset">重置默认</button>' +
    '</div>';

  var panelContainer = document.createElement('div');
  panelContainer.innerHTML = panelHTML;
  while (panelContainer.firstChild) {
    document.body.appendChild(panelContainer.firstChild);
  }

  // ── 绑定事件 ──
  var toggleBtn = document.getElementById('ba-fx-toggle');
  var panel = document.getElementById('ba-fx-panel');
  var closeBtn = document.getElementById('ba-fx-panel-close');
  var colorInput = document.getElementById('ba-fx-color');
  var trailCheck = document.getElementById('ba-fx-trail');
  var trailAlwaysCheck = document.getElementById('ba-fx-trail-always');
  var clickCheck = document.getElementById('ba-fx-click');
  var resetBtn = document.getElementById('ba-fx-reset');

  var panelOpen = false;
  function openPanel() {
    panel.classList.add('open');
    toggleBtn.classList.add('active');
    panelOpen = true;
  }
  function closePanelFunc() {
    panel.classList.remove('open');
    toggleBtn.classList.remove('active');
    panelOpen = false;
  }

  toggleBtn.addEventListener('click', function() {
    panelOpen ? closePanelFunc() : openPanel();
  });
  closeBtn.addEventListener('click', closePanelFunc);

  // 点击面板外关闭
  document.addEventListener('click', function(e) {
    if (panelOpen && !panel.contains(e.target) && e.target !== toggleBtn) {
      closePanelFunc();
    }
  });

  // 颜色选择器
  colorInput.addEventListener('input', function() {
    var rgb = hexToRgb(colorInput.value);
    __baClickFX.setColor(rgb[0], rgb[1], rgb[2]);
    saveSettings();
  });

  // 启用拖尾
  trailCheck.addEventListener('change', function() {
    __baClickFX.setTrail(trailCheck.checked);
    saveSettings();
  });

  // 始终显示（仅在启用拖尾时生效）
  trailAlwaysCheck.addEventListener('change', function() {
    __baClickFX.setTrailAlways(trailAlwaysCheck.checked);
    saveSettings();
  });

  // 点击特效：官方 setClick API
  clickCheck.addEventListener('change', function() {
    initClickFx = clickCheck.checked;
    __baClickFX.setClick(initClickFx);
    saveSettings();
  });

  // 重置
  resetBtn.addEventListener('click', function() {
    colorInput.value = DEFAULTS.color;
    var rgb = hexToRgb(DEFAULTS.color);
    __baClickFX.setColor(rgb[0], rgb[1], rgb[2]);
    trailCheck.checked = DEFAULTS.trail;
    __baClickFX.setTrail(DEFAULTS.trail);
    trailAlwaysCheck.checked = DEFAULTS.trailAlways;
    __baClickFX.setTrailAlways(DEFAULTS.trailAlways);
    clickCheck.checked = DEFAULTS.clickFx;
    __baClickFX.setClick(true);
    initClickFx = true;
    localStorage.removeItem('ba-fx-panel');
  });
})();
