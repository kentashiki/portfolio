class NetworkAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.tapNodes = [];
    this.nodeCount = 50;
    this.maxDistance = 150;
    this.mouse = { x: null, y: null };
    this.tapNodeLifetime = 1800;
    this.tapMoveThreshold = 12;
    this.tapMaxDuration = 300;
    this.activeTouch = null;
    this.resizeFrame = null;
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.resizeCanvas({ force: true });
    this.createNodes();
  }

  resizeCanvas({ force = false } = {}) {
    const nextWidth = this.canvas.offsetWidth;
    const nextHeight = this.canvas.offsetHeight;
    const prevWidth = this.canvas.width;
    const prevHeight = this.canvas.height;

    if (!force && nextWidth === prevWidth && nextHeight === prevHeight) {
      return false;
    }

    this.canvas.width = nextWidth;
    this.canvas.height = nextHeight;

    if (!force && prevWidth > 0 && prevHeight > 0) {
      const widthRatio = nextWidth / prevWidth;
      const heightRatio = nextHeight / prevHeight;

      this.nodes.forEach((node) => {
        node.x *= widthRatio;
        node.y *= heightRatio;
      });

      this.tapNodes = this.tapNodes
        .map((tapNode) => ({
          ...tapNode,
          x: tapNode.x * widthRatio,
          y: tapNode.y * heightRatio,
        }))
        .filter((tapNode) => tapNode.x >= 0 && tapNode.x <= nextWidth && tapNode.y >= 0 && tapNode.y <= nextHeight);
    }

    return true;
  }

  handleResize() {
    if (this.resizeFrame !== null) {
      return;
    }

    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = null;
      this.resizeCanvas();
    });
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }
  }

  getCanvasPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  addTapNode(x, y) {
    this.tapNodes.push({
      x,
      y,
      createdAt: performance.now(),
      radius: 3.5,
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.handleResize(), { passive: true });

    this.canvas.addEventListener('mousemove', (e) => {
      const point = this.getCanvasPoint(e.clientX, e.clientY);
      this.mouse.x = point.x;
      this.mouse.y = point.y;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];

      if (!touch) {
        return;
      }

      const point = this.getCanvasPoint(touch.clientX, touch.clientY);
      this.activeTouch = {
        id: touch.identifier,
        startX: point.x,
        startY: point.y,
        currentX: point.x,
        currentY: point.y,
        startTime: performance.now(),
        moved: false,
      };
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.activeTouch) {
        return;
      }

      const touch = Array.from(e.changedTouches).find(({ identifier }) => identifier === this.activeTouch.id);

      if (!touch) {
        return;
      }

      const point = this.getCanvasPoint(touch.clientX, touch.clientY);
      this.activeTouch.currentX = point.x;
      this.activeTouch.currentY = point.y;

      const dx = point.x - this.activeTouch.startX;
      const dy = point.y - this.activeTouch.startY;

      if (Math.hypot(dx, dy) > this.tapMoveThreshold) {
        this.activeTouch.moved = true;
      }

      this.mouse.x = null;
      this.mouse.y = null;
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (!this.activeTouch) {
        return;
      }

      const touch = Array.from(e.changedTouches).find(({ identifier }) => identifier === this.activeTouch.id);

      if (!touch) {
        return;
      }

      const point = this.getCanvasPoint(touch.clientX, touch.clientY);
      const duration = performance.now() - this.activeTouch.startTime;

      if (!this.activeTouch.moved && duration <= this.tapMaxDuration) {
        this.addTapNode(point.x, point.y);
      }

      this.activeTouch = null;
      this.mouse.x = null;
      this.mouse.y = null;
    }, { passive: true });

    this.canvas.addEventListener('touchcancel', () => {
      this.activeTouch = null;
      this.mouse.x = null;
      this.mouse.y = null;
    }, { passive: true });
  }

  drawNodes() {
    this.nodes.forEach(node => {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.fill();
    });
  }

  drawLines() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.maxDistance) {
          const opacity = (1 - distance / this.maxDistance) * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  drawMouseConnections() {
    if (this.mouse.x === null || this.mouse.y === null) return;

    this.nodes.forEach(node => {
      const dx = node.x - this.mouse.x;
      const dy = node.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.maxDistance * 1.5) {
        const opacity = (1 - distance / (this.maxDistance * 1.5)) * 0.7;
        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });
  }

  drawTapConnections() {
    if (!this.tapNodes.length) return;

    const now = performance.now();

    this.tapNodes = this.tapNodes.filter((tapNode) => now - tapNode.createdAt < this.tapNodeLifetime);

    this.tapNodes.forEach((tapNode) => {
      const age = now - tapNode.createdAt;
      const lifeRatio = 1 - age / this.tapNodeLifetime;
      const connectionDistance = this.maxDistance * 1.35;

      this.nodes.forEach((node) => {
        const dx = node.x - tapNode.x;
        const dy = node.y - tapNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.7 * lifeRatio;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(tapNode.x, tapNode.y);
          this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });

      this.ctx.beginPath();
      this.ctx.arc(tapNode.x, tapNode.y, tapNode.radius + lifeRatio * 1.4, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(100, 200, 255, ${0.75 * lifeRatio})`;
      this.ctx.fill();
    });
  }

  updateNodes() {
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawLines();
    this.drawMouseConnections();
    this.drawTapConnections();
    this.drawNodes();
    this.updateNodes();

    requestAnimationFrame(() => this.animate());
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('network-canvas')) {
    new NetworkAnimation('network-canvas');
  }
});
