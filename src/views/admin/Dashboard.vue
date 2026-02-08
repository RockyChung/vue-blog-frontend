<template>
  <div class="dashboard">
    <h2 class="page-title">儀表板</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>文章總數</h3>
        <p class="number">0</p>
      </div>
      <div class="stat-card">
        <h3>總瀏覽量</h3>
        <p class="number">0</p>
      </div>
      <div class="stat-card">
        <h3>系統狀態</h3>
        <p class="status">正常運作中</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { margin-bottom: 30px; color: #333; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.number { font-size: 36px; font-weight: bold; color: #42b983; margin: 10px 0 0; }
.status { font-size: 24px; color: #2c3e50; margin: 10px 0 0; }
</style>