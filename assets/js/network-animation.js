class NetworkAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.nodeCount = 50;
    this.maxDistance = 150;
    this.mouse = { x: null, y: null };
    
    this.init();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.createNodes();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
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

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createNodes();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  drawNodes() {
    this.nodes.forEach(node => {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(1, 17, 33, 0.6)';
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
          const opacity = (1 - distance / this.maxDistance) * 0.3;
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = `rgba(1, 17, 33, ${opacity})`;
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
        const opacity = (1 - distance / (this.maxDistance * 1.5)) * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(0, 102, 204, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
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