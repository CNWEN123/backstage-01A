// 全局变量
let currentUser = null;
let currentRole = null; // 'shareholder' 或 'agent'

// API 请求封装
async function api(url, options = {}) {
  const token = localStorage.getItem('agent_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  
  if (!data.success && response.status === 401) {
    handleLogout();
  }
  
  return data;
}

// 工具函数 - 防止XSS攻击
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// 格式化金额
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
}

// Toast 提示
function showToast(message, type = 'info') {
  const bgColors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  };
  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 登录处理
async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const agent_username = form.username.value.trim();
  const password = form.password.value;

  try {
    const result = await api('/api/agent/login', {
      method: 'POST',
      body: JSON.stringify({ agent_username, password })
    });

    if (result.success) {
      currentUser = result.data.user;
      currentRole = result.data.user.role; // 'shareholder' 或 'agent'
      localStorage.setItem('agent_token', result.data.token);
      
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('main-page').classList.remove('hidden');
      
      initMainPage();
      showToast('登录成功！', 'success');
    } else {
      showToast(result.error || '登录失败', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('登录失败，请稍后重试', 'error');
  }
}

// 退出登录
function handleLogout() {
  localStorage.removeItem('agent_token');
  currentUser = null;
  currentRole = null;
  
  document.getElementById('main-page').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('login-form').reset();
}

// 初始化主页面
function initMainPage() {
  document.getElementById('current-username').textContent = currentUser.username;
  document.getElementById('current-role').textContent = currentRole === 'shareholder' ? '股东' : '代理';
  document.getElementById('nav-title').textContent = currentRole === 'shareholder' ? '股东后台' : '代理后台';
  
  renderSidebar();
  showModule('dashboard');
}

// 渲染侧边栏
function renderSidebar() {
  const shareholderMenu = [
    { id: 'dashboard', icon: 'fa-chart-line', name: '数据概览' },
    { id: 'team-manage', icon: 'fa-users', name: '团队管理' },
    { id: 'team-report', icon: 'fa-chart-bar', name: '团队报表' },
    { id: 'commission', icon: 'fa-percentage', name: '佣金明细' },
    { id: 'account', icon: 'fa-user-cog', name: '账户设置' }
  ];

  const agentMenu = [
    { id: 'dashboard', icon: 'fa-chart-line', name: '数据概览' },
    { id: 'team-manage', icon: 'fa-users', name: '团队管理' },
    { id: 'team-report', icon: 'fa-chart-bar', name: '团队报表' },
    { id: 'commission', icon: 'fa-percentage', name: '佣金明细' },
    { id: 'account', icon: 'fa-user-cog', name: '账户设置' }
  ];

  const menu = currentRole === 'shareholder' ? shareholderMenu : agentMenu;
  
  const sidebarHtml = menu.map(item => `
    <div class="sidebar-item px-4 py-3 rounded-lg cursor-pointer transition mb-2" 
         onclick="showModule('${item.id}')" data-module="${item.id}">
      <i class="fas ${item.icon} mr-3 text-primary"></i>
      <span>${item.name}</span>
    </div>
  `).join('');
  
  document.getElementById('sidebar-menu').innerHTML = sidebarHtml;
}

// 显示模块
function showModule(moduleId) {
  // 更新侧边栏激活状态
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-module="${moduleId}"]`)?.classList.add('active');
  
  // 渲染对应模块
  const content = document.getElementById('main-content');
  
  switch(moduleId) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'team-manage':
      renderTeamManage();
      break;
    case 'subordinates':
      renderSubordinates();
      break;
    case 'players':
      renderPlayers();
      break;
    case 'team-report':
      renderTeamReport();
      break;
    case 'commission':
      renderCommission();
      break;
    case 'account':
      renderAccount();
      break;
  }
}

// 渲染数据概览
async function renderDashboard() {
  const content = document.getElementById('main-content');
  
  content.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold mb-6">
        <i class="fas fa-chart-line text-primary mr-3"></i>数据概览
      </h2>
      
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm opacity-90">今日营收</div>
            <i class="fas fa-dollar-sign text-2xl opacity-75"></i>
          </div>
          <div class="text-3xl font-bold" id="stat-today-revenue">¥0.00</div>
          <div class="text-sm opacity-75 mt-2">较昨日 <span class="font-semibold" id="stat-revenue-change">+0%</span></div>
        </div>
        
        <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm opacity-90">团队人数</div>
            <i class="fas fa-users text-2xl opacity-75"></i>
          </div>
          <div class="text-3xl font-bold" id="stat-team-count">0</div>
          <div class="text-sm opacity-75 mt-2">下级代理 <span class="font-semibold" id="stat-agent-count">0</span> 人</div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm opacity-90">本月佣金</div>
            <i class="fas fa-percentage text-2xl opacity-75"></i>
          </div>
          <div class="text-3xl font-bold" id="stat-month-commission">¥0.00</div>
          <div class="text-sm opacity-75 mt-2">已结算 <span class="font-semibold" id="stat-settled-commission">¥0.00</span></div>
        </div>
        
        <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm opacity-90">活跃玩家</div>
            <i class="fas fa-user-friends text-2xl opacity-75"></i>
          </div>
          <div class="text-3xl font-bold" id="stat-active-players">0</div>
          <div class="text-sm opacity-75 mt-2">今日新增 <span class="font-semibold" id="stat-new-players">0</span> 人</div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-chart-area text-primary mr-2"></i>近7日营收趋势
          </h3>
          <div class="chart-container">
            <canvas id="revenue-chart"></canvas>
          </div>
        </div>
        
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-chart-pie text-primary mr-2"></i>团队结构分布
          </h3>
          <div class="chart-container">
            <canvas id="team-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 加载统计数据
  loadDashboardStats();
}

// 加载仪表盘统计数据
async function loadDashboardStats() {
  try {
    const result = await api('/api/agent/dashboard/stats');
    
    if (result.success) {
      const stats = result.data;
      
      document.getElementById('stat-today-revenue').textContent = '¥' + formatMoney(stats.todayRevenue);
      document.getElementById('stat-revenue-change').textContent = (stats.revenueChange >= 0 ? '+' : '') + stats.revenueChange + '%';
      document.getElementById('stat-team-count').textContent = stats.teamCount;
      document.getElementById('stat-agent-count').textContent = stats.agentCount;
      document.getElementById('stat-month-commission').textContent = '¥' + formatMoney(stats.monthCommission);
      document.getElementById('stat-settled-commission').textContent = '¥' + formatMoney(stats.settledCommission);
      document.getElementById('stat-active-players').textContent = stats.activePlayers;
      document.getElementById('stat-new-players').textContent = stats.newPlayers;
      
      // 渲染图表
      renderRevenueChart(stats.revenueChart);
      renderTeamChart(stats.teamChart);
    }
  } catch (error) {
    console.error('Load dashboard stats error:', error);
  }
}

// 渲染营收趋势图表
function renderRevenueChart(data) {
  const ctx = document.getElementById('revenue-chart');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data?.labels || ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [{
        label: '营收',
        data: data?.values || [12000, 15000, 13000, 18000, 16000, 20000, 22000],
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { 
          beginAtZero: true,
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        },
        x: { 
          ticks: { color: '#9ca3af' },
          grid: { color: '#374151' }
        }
      }
    }
  });
}

// 渲染团队结构图表
function renderTeamChart(data) {
  const ctx = document.getElementById('team-chart');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data?.labels || ['直属代理', '二级代理', '三级代理', '玩家'],
      datasets: [{
        data: data?.values || [10, 25, 40, 180],
        backgroundColor: ['#1e40af', '#7c3aed', '#059669', '#d97706']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#9ca3af', padding: 15 }
        }
      }
    }
  });
}

// ========================================
// 团队管理功能（合并代理和玩家）
// ========================================

// 渲染团队管理（主函数）
async function renderTeamManage() {
  const content = document.getElementById('main-content');
  
  content.innerHTML = `
    <div class="fade-in">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          <i class="fas fa-users text-primary mr-3"></i>团队管理
        </h2>
        <div class="flex items-center space-x-3">
          <button onclick="showAddAgentModal()" class="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
            <i class="fas fa-user-plus mr-2"></i>新增代理
          </button>
          <button onclick="showAddPlayerModal()" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition">
            <i class="fas fa-user-plus mr-2"></i>新增会员
          </button>
        </div>
      </div>
      
      <!-- 选项卡 -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 mb-6">
        <div class="flex border-b border-gray-700">
          <button onclick="switchTeamTab('agents')" data-team-tab="agents" class="team-tab-btn flex-1 px-6 py-4 text-center transition hover:bg-gray-750 border-b-2 border-primary">
            <i class="fas fa-sitemap mr-2"></i>下级代理
          </button>
          <button onclick="switchTeamTab('players')" data-team-tab="players" class="team-tab-btn flex-1 px-6 py-4 text-center transition hover:bg-gray-750 border-b-2 border-transparent">
            <i class="fas fa-user-friends mr-2"></i>玩家会员
          </button>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div id="team-tab-content">
        <!-- 动态渲染 -->
      </div>
    </div>
  `;
  
  switchTeamTab('agents');
}

// 切换团队管理选项卡
function switchTeamTab(tab) {
  // 更新选项卡样式
  document.querySelectorAll('.team-tab-btn').forEach(btn => {
    btn.classList.remove('border-primary');
    btn.classList.add('border-transparent');
  });
  document.querySelector(`[data-team-tab="${tab}"]`).classList.remove('border-transparent');
  document.querySelector(`[data-team-tab="${tab}"]`).classList.add('border-primary');
  
  const content = document.getElementById('team-tab-content');
  
  if (tab === 'agents') {
    renderAgentsTab();
  } else {
    renderPlayersTab();
  }
}

// 渲染代理选项卡
async function renderAgentsTab() {
  const content = document.getElementById('team-tab-content');
  
  content.innerHTML = `
    <!-- 搜索和筛选栏 -->
    <div class="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-2">搜索</label>
          <input type="text" id="search-agent" placeholder="账号/姓名/手机号"
                 class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-2">层级</label>
          <select id="filter-agent-level" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
            <option value="">全部层级</option>
            <option value="1">一级代理</option>
            <option value="2">二级代理</option>
            <option value="3">三级代理</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-2">状态</label>
          <select id="filter-agent-status" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
            <option value="">全部状态</option>
            <option value="1">正常</option>
            <option value="0">停用</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button onclick="searchAgents()" class="w-full bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
            <i class="fas fa-search mr-2"></i>查询
          </button>
        </div>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-700">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold">账号</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">姓名</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">层级</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">下级人数</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">玩家人数</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">本月业绩</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">状态</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">操作</th>
          </tr>
        </thead>
        <tbody id="agents-table-body">
          <tr>
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
              <div>加载中...</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页 -->
    <div id="agents-pagination" class="mt-6 flex items-center justify-between">
      <!-- 动态渲染 -->
    </div>
  `;
  
  loadAgents();
}

// 渲染玩家选项卡
async function renderPlayersTab() {
  const content = document.getElementById('team-tab-content');
  
  content.innerHTML = `
    <!-- 搜索和筛选栏 -->
    <div class="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-2">搜索</label>
          <input type="text" id="search-player" placeholder="账号/姓名/手机号"
                 class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-2">VIP等级</label>
          <select id="filter-player-vip" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
            <option value="">全部等级</option>
            <option value="1">VIP1</option>
            <option value="2">VIP2</option>
            <option value="3">VIP3</option>
            <option value="4">VIP4</option>
            <option value="5">VIP5</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm text-gray-400 mb-2">状态</label>
          <select id="filter-player-status" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
            <option value="">全部状态</option>
            <option value="active">活跃</option>
            <option value="inactive">不活跃</option>
            <option value="frozen">冻结</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button onclick="searchPlayers()" class="w-full bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
            <i class="fas fa-search mr-2"></i>查询
          </button>
        </div>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-700">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-semibold">账号</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">姓名</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">VIP等级</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">余额</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">本月投注</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">本月输赢</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">状态</th>
            <th class="px-6 py-4 text-left text-sm font-semibold">操作</th>
          </tr>
        </thead>
        <tbody id="players-table-body">
          <tr>
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
              <div>加载中...</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页 -->
    <div id="players-pagination" class="mt-6 flex items-center justify-between">
      <!-- 动态渲染 -->
    </div>
  `;
  
  loadPlayers();
}

// 加载代理列表
async function loadAgents(page = 1) {
  try {
    const search = document.getElementById('search-agent')?.value || '';
    const level = document.getElementById('filter-agent-level')?.value || '';
    const status = document.getElementById('filter-agent-status')?.value || '';
    
    const result = await api(`/api/agent/subordinates?page=${page}&search=${search}&level=${level}&status=${status}`);
    
    if (result.success) {
      const tbody = document.getElementById('agents-table-body');
      const data = result.data;
      
      if (data.list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-inbox text-4xl mb-2"></i>
              <div>暂无数据</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = data.list.map(item => `
        <tr class="border-t border-gray-700 hover:bg-gray-750">
          <td class="px-6 py-4">
            <div class="font-medium">${escapeHtml(item.username)}</div>
            <div class="text-sm text-gray-400">${escapeHtml(item.phone || '-')}</div>
          </td>
          <td class="px-6 py-4">${escapeHtml(item.real_name || '-')}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
              ${item.level}级代理
            </span>
          </td>
          <td class="px-6 py-4">
            <span class="text-blue-400 font-semibold">${item.subordinate_count}</span> 人
          </td>
          <td class="px-6 py-4">
            <span class="text-green-400 font-semibold">${item.player_count}</span> 人
          </td>
          <td class="px-6 py-4">
            <div class="font-semibold text-green-400">¥${formatMoney(item.month_performance)}</div>
          </td>
          <td class="px-6 py-4">
            ${item.status === 1 
              ? '<span class="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">正常</span>'
              : '<span class="px-2 py-1 bg-red-900 text-red-300 rounded text-sm">停用</span>'}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center space-x-2">
              <button onclick="viewAgentDetail(${item.id})" class="text-blue-400 hover:text-blue-300" title="查看详情">
                <i class="fas fa-eye"></i>
              </button>
              <button onclick="editAgent(${item.id})" class="text-green-400 hover:text-green-300" title="编辑">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Load agents error:', error);
    showToast('加载代理列表失败', 'error');
  }
}

// 加载玩家列表
async function loadPlayers(page = 1) {
  try {
    const search = document.getElementById('search-player')?.value || '';
    const vip = document.getElementById('filter-player-vip')?.value || '';
    const status = document.getElementById('filter-player-status')?.value || '';
    
    const result = await api(`/api/agent/players?page=${page}&search=${search}&vip=${vip}&status=${status}`);
    
    if (result.success) {
      const tbody = document.getElementById('players-table-body');
      const data = result.data;
      
      if (data.list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-inbox text-4xl mb-2"></i>
              <div>暂无数据</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = data.list.map(item => `
        <tr class="border-t border-gray-700 hover:bg-gray-750">
          <td class="px-6 py-4">
            <div class="font-medium">${escapeHtml(item.username)}</div>
            <div class="text-sm text-gray-400">${escapeHtml(item.phone || '-')}</div>
          </td>
          <td class="px-6 py-4">${escapeHtml(item.real_name || '-')}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-sm">
              VIP${item.vip_level || 0}
            </span>
          </td>
          <td class="px-6 py-4">
            <div class="font-semibold text-blue-400">¥${formatMoney(item.balance)}</div>
          </td>
          <td class="px-6 py-4 text-gray-300">¥${formatMoney(item.month_bet)}</td>
          <td class="px-6 py-4">
            <span class="${item.month_profit >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold">
              ¥${formatMoney(Math.abs(item.month_profit))}
            </span>
          </td>
          <td class="px-6 py-4">
            ${item.status === 'active' 
              ? '<span class="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">活跃</span>'
              : item.status === 'frozen'
              ? '<span class="px-2 py-1 bg-red-900 text-red-300 rounded text-sm">冻结</span>'
              : '<span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">不活跃</span>'}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center space-x-2">
              <button onclick="viewPlayerDetail(${item.id})" class="text-blue-400 hover:text-blue-300" title="查看详情">
                <i class="fas fa-eye"></i>
              </button>
              <button onclick="editPlayer(${item.id})" class="text-green-400 hover:text-green-300" title="编辑">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Load players error:', error);
    showToast('加载玩家列表失败', 'error');
  }
}

// 搜索代理
function searchAgents() {
  loadAgents(1);
}

// 搜索玩家
function searchPlayers() {
  loadPlayers(1);
}

// 查看代理详情
function viewAgentDetail(id) {
  showToast('查看代理详情功能开发中...', 'info');
}

// 编辑代理
function editAgent(id) {
  showToast('编辑代理功能开发中...', 'info');
}

// 查看玩家详情
function viewPlayerDetail(id) {
  showToast('查看玩家详情功能开发中...', 'info');
}

// 编辑玩家
function editPlayer(id) {
  showToast('编辑玩家功能开发中...', 'info');
}

// 渲染下级代理管理
async function renderSubordinates() {
  const content = document.getElementById('main-content');
  
  content.innerHTML = `
    <div class="fade-in">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          <i class="fas fa-users text-primary mr-3"></i>下级代理管理
        </h2>
        <button onclick="showAddSubordinateModal()" class="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
          <i class="fas fa-plus mr-2"></i>新增下级
        </button>
      </div>
      
      <!-- 搜索和筛选栏 -->
      <div class="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">搜索</label>
            <input type="text" id="search-subordinate" placeholder="账号/姓名/手机号"
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">层级</label>
            <select id="filter-level" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
              <option value="">全部层级</option>
              <option value="1">一级代理</option>
              <option value="2">二级代理</option>
              <option value="3">三级代理</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">状态</label>
            <select id="filter-status" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
              <option value="">全部状态</option>
              <option value="1">正常</option>
              <option value="0">停用</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button onclick="loadSubordinates()" class="w-full bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <i class="fas fa-search mr-2"></i>查询
            </button>
          </div>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold">账号</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">姓名</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">层级</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">下级人数</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">玩家人数</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">本月业绩</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">状态</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">操作</th>
            </tr>
          </thead>
          <tbody id="subordinates-table-body">
            <tr>
              <td colspan="8" class="px-6 py-12 text-center text-gray-400">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <div>加载中...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div id="subordinates-pagination" class="mt-6 flex items-center justify-between">
        <!-- 动态渲染 -->
      </div>
    </div>
  `;
  
  loadSubordinates();
}

// 加载下级代理列表
async function loadSubordinates(page = 1) {
  try {
    const search = document.getElementById('search-subordinate')?.value || '';
    const level = document.getElementById('filter-level')?.value || '';
    const status = document.getElementById('filter-status')?.value || '';
    
    const result = await api(`/api/agent/subordinates?page=${page}&search=${search}&level=${level}&status=${status}`);
    
    if (result.success) {
      const tbody = document.getElementById('subordinates-table-body');
      const data = result.data;
      
      if (data.list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-inbox text-4xl mb-2"></i>
              <div>暂无数据</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = data.list.map(item => `
        <tr class="border-t border-gray-700 hover:bg-gray-750">
          <td class="px-6 py-4">
            <div class="font-medium">${escapeHtml(item.username)}</div>
            <div class="text-sm text-gray-400">${escapeHtml(item.phone || '-')}</div>
          </td>
          <td class="px-6 py-4">${escapeHtml(item.real_name || '-')}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
              ${item.level}级代理
            </span>
          </td>
          <td class="px-6 py-4">
            <span class="text-blue-400 font-semibold">${item.subordinate_count}</span> 人
          </td>
          <td class="px-6 py-4">
            <span class="text-green-400 font-semibold">${item.player_count}</span> 人
          </td>
          <td class="px-6 py-4">
            <div class="font-semibold text-green-400">¥${formatMoney(item.month_performance)}</div>
          </td>
          <td class="px-6 py-4">
            ${item.status === 1 
              ? '<span class="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">正常</span>'
              : '<span class="px-2 py-1 bg-red-900 text-red-300 rounded text-sm">停用</span>'}
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center space-x-2">
              <button onclick="viewSubordinateDetail(${item.id})" class="text-blue-400 hover:text-blue-300" title="查看详情">
                <i class="fas fa-eye"></i>
              </button>
              <button onclick="editSubordinate(${item.id})" class="text-green-400 hover:text-green-300" title="编辑">
                <i class="fas fa-edit"></i>
              </button>
              <button onclick="viewSubordinateTree(${item.id})" class="text-purple-400 hover:text-purple-300" title="查看团队">
                <i class="fas fa-sitemap"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
      
      renderPagination('subordinates', data.pagination);
    }
  } catch (error) {
    console.error('Load subordinates error:', error);
    showToast('加载数据失败', 'error');
  }
}

// 渲染分页
function renderPagination(prefix, pagination) {
  const container = document.getElementById(`${prefix}-pagination`);
  if (!container || !pagination) return;
  
  const { current, total, pageSize } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = `
    <div class="text-sm text-gray-400">
      共 ${total} 条记录，第 ${current}/${totalPages} 页
    </div>
    <div class="flex items-center space-x-2">
      <button onclick="loadSubordinates(${current - 1})" 
              ${current === 1 ? 'disabled' : ''}
              class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fas fa-chevron-left"></i>
      </button>
      ${Array.from({length: Math.min(5, totalPages)}, (_, i) => {
        const page = i + 1;
        return `
          <button onclick="loadSubordinates(${page})" 
                  class="px-3 py-1 rounded ${current === page ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}">
            ${page}
          </button>
        `;
      }).join('')}
      <button onclick="loadSubordinates(${current + 1})" 
              ${current === totalPages ? 'disabled' : ''}
              class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;
}

// 显示新增下级弹窗
function showAddSubordinateModal() {
  const modalHtml = `
    <div id="subordinate-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <h3 class="text-xl font-bold mb-6">
          <i class="fas fa-user-plus text-primary mr-2"></i>新增下级代理
        </h3>
        
        <form onsubmit="submitSubordinate(event)">
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">账号 *</label>
              <input type="text" name="username" required
                     class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                     placeholder="字母开头，6-20位">
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-2">密码 *</label>
              <input type="password" name="password" required
                     class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                     placeholder="6-20位">
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-2">姓名 *</label>
              <input type="text" name="real_name" required
                     class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-2">手机号 *</label>
              <input type="tel" name="phone" required
                     class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                     placeholder="11位手机号">
            </div>
            
            <div>
              <label class="block text-sm text-gray-400 mb-2">佣金比例 (%)</label>
              <input type="number" name="commission_rate" min="0" max="100" step="0.01"
                     class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                     placeholder="0-100">
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <button type="button" onclick="closeModal('subordinate-modal')" 
                    class="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition">
              取消
            </button>
            <button type="submit" class="flex-1 bg-primary hover:bg-blue-700 py-2 rounded-lg transition">
              <i class="fas fa-check mr-2"></i>确定
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 提交新增下级
async function submitSubordinate(event) {
  event.preventDefault();
  const form = event.target;
  
  const data = {
    username: form.username.value.trim(),
    password: form.password.value,
    real_name: form.real_name.value.trim(),
    phone: form.phone.value.trim(),
    commission_rate: form.commission_rate.value || 0
  };
  
  try {
    const result = await api('/api/agent/subordinates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (result.success) {
      showToast('新增成功！', 'success');
      closeModal('subordinate-modal');
      loadSubordinates();
    } else {
      showToast(result.error || '新增失败', 'error');
    }
  } catch (error) {
    console.error('Submit subordinate error:', error);
    showToast('操作失败，请稍后重试', 'error');
  }
}

// 关闭弹窗
function closeModal(modalId) {
  document.getElementById(modalId)?.remove();
}

// 查看下级详情
async function viewSubordinateDetail(id) {
  showToast('查看详情功能开发中...', 'info');
}

// 编辑下级
async function editSubordinate(id) {
  showToast('编辑功能开发中...', 'info');
}

// 查看下级团队树
async function viewSubordinateTree(id) {
  showToast('团队树功能开发中...', 'info');
}

// 渲染玩家管理（仅代理可见）
function renderPlayers() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold mb-6">
        <i class="fas fa-user-friends text-primary mr-3"></i>玩家管理
      </h2>
      <div class="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
        <i class="fas fa-user-friends text-6xl text-gray-600 mb-4"></i>
        <p class="text-gray-400 text-lg">功能开发中...</p>
      </div>
    </div>
  `;
}

// 渲染团队报表
// 渲染团队报表
function renderTeamReport() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="fade-in">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          <i class="fas fa-chart-bar text-primary mr-3"></i>团队报表
        </h2>
        <button onclick="exportTeamReport()" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
          <i class="fas fa-download mr-2"></i>导出报表
        </button>
      </div>
      
      <!-- 搜索查询栏 -->
      <div class="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">日期范围</label>
            <input type="date" id="report-start-date" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">&nbsp;</label>
            <input type="date" id="report-end-date" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">账号搜索</label>
            <input type="text" id="report-search" placeholder="账号/姓名/手机号" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">类型筛选</label>
            <select id="report-type" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
              <option value="">全部</option>
              <option value="agent">下级代理</option>
              <option value="player">会员玩家</option>
            </select>
          </div>
          <div class="flex items-end">
            <button onclick="searchTeamReport()" class="w-full bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <i class="fas fa-search mr-2"></i>查询
            </button>
          </div>
        </div>
      </div>
      
      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">团队总人数</span>
            <i class="fas fa-users text-blue-400"></i>
          </div>
          <div class="text-2xl font-bold" id="team-total-members">0</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">团队总业绩</span>
            <i class="fas fa-chart-line text-green-400"></i>
          </div>
          <div class="text-2xl font-bold text-green-400" id="team-total-performance">¥0.00</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">团队总输赢</span>
            <i class="fas fa-coins text-yellow-400"></i>
          </div>
          <div class="text-2xl font-bold" id="team-total-profit">¥0.00</div>
        </div>
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">我的佣金</span>
            <i class="fas fa-percentage text-purple-400"></i>
          </div>
          <div class="text-2xl font-bold text-purple-400" id="team-my-commission">¥0.00</div>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold">账号</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">姓名</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">类型</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">投注额</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">有效投注</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">输赢</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">占成比例</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">我的分成</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">操作</th>
            </tr>
          </thead>
          <tbody id="team-report-table-body">
            <tr>
              <td colspan="9" class="px-6 py-12 text-center text-gray-400">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <div>加载中...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div id="team-report-pagination" class="mt-6 flex items-center justify-between">
        <!-- 动态渲染 -->
      </div>
    </div>
  `;
  
  // 设置默认日期（本月）
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  document.getElementById('report-start-date').value = firstDay.toISOString().split('T')[0];
  document.getElementById('report-end-date').value = today.toISOString().split('T')[0];
  
  loadTeamReport();
}

// 渲染佣金明细
function renderCommission() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold mb-6">
        <i class="fas fa-percentage text-primary mr-3"></i>佣金明细
      </h2>
      
      <!-- 搜索查询栏 -->
      <div class="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">开始日期</label>
            <input type="date" id="commission-start-date" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">结束日期</label>
            <input type="date" id="commission-end-date" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">账号搜索</label>
            <input type="text" id="commission-search" placeholder="账号/姓名" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">对象类型</label>
            <select id="commission-role" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
              <option value="">全部</option>
              <option value="agent">下级代理</option>
              <option value="player">下级会员</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">结算状态</label>
            <select id="commission-status" class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
              <option value="">全部</option>
              <option value="pending">待结算</option>
              <option value="settled">已结算</option>
            </select>
          </div>
          <div class="flex items-end space-x-2">
            <button onclick="searchCommission()" class="flex-1 bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
              <i class="fas fa-search mr-2"></i>查询
            </button>
            <button onclick="exportCommission()" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition" title="导出">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 佣金汇总统计 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">累计佣金</span>
            <i class="fas fa-coins text-2xl opacity-75"></i>
          </div>
          <div class="text-2xl font-bold" id="commission-total">¥0.00</div>
          <div class="text-sm opacity-75 mt-2">包含所有已结算佣金</div>
        </div>
        <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">本月佣金</span>
            <i class="fas fa-calendar-alt text-2xl opacity-75"></i>
          </div>
          <div class="text-2xl font-bold" id="commission-month">¥0.00</div>
          <div class="text-sm opacity-75 mt-2">当月累计佣金收入</div>
        </div>
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">待结算</span>
            <i class="fas fa-hourglass-half text-2xl opacity-75"></i>
          </div>
          <div class="text-2xl font-bold" id="commission-pending">¥0.00</div>
          <div class="text-sm opacity-75 mt-2">等待结算的佣金</div>
        </div>
        <div class="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm opacity-90">今日佣金</span>
            <i class="fas fa-clock text-2xl opacity-75"></i>
          </div>
          <div class="text-2xl font-bold" id="commission-today">¥0.00</div>
          <div class="text-sm opacity-75 mt-2">今日新增佣金</div>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold">日期</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">对象账号</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">对象类型</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">有效投注</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">输赢金额</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">占成比例</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">佣金金额</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">状态</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">操作</th>
            </tr>
          </thead>
          <tbody id="commission-table-body">
            <tr>
              <td colspan="9" class="px-6 py-12 text-center text-gray-400">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <div>加载中...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div id="commission-pagination" class="mt-6 flex items-center justify-between">
        <!-- 动态渲染 -->
      </div>
    </div>
  `;
  
  // 设置默认日期（本月）
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  document.getElementById('commission-start-date').value = firstDay.toISOString().split('T')[0];
  document.getElementById('commission-end-date').value = today.toISOString().split('T')[0];
  
  loadCommission();
}

// 渲染账户设置
function renderAccount() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="fade-in">
      <h2 class="text-2xl font-bold mb-6">
        <i class="fas fa-user-cog text-primary mr-3"></i>账户设置
      </h2>
      
      <!-- 选项卡 -->
      <div class="bg-gray-800 rounded-xl border border-gray-700 mb-6">
        <div class="flex border-b border-gray-700">
          <button onclick="showAccountTab('profile')" data-tab="profile" class="account-tab-btn flex-1 px-6 py-4 text-center transition hover:bg-gray-750 border-b-2 border-primary">
            <i class="fas fa-user mr-2"></i>个人信息
          </button>
          <button onclick="showAccountTab('password')" data-tab="password" class="account-tab-btn flex-1 px-6 py-4 text-center transition hover:bg-gray-750 border-b-2 border-transparent">
            <i class="fas fa-key mr-2"></i>修改密码
          </button>
          <button onclick="showAccountTab('logs')" data-tab="logs" class="account-tab-btn flex-1 px-6 py-4 text-center transition hover:bg-gray-750 border-b-2 border-transparent">
            <i class="fas fa-history mr-2"></i>登录日志
          </button>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div id="account-tab-content">
        <!-- 动态渲染 -->
      </div>
    </div>
  `;
  
  showAccountTab('profile');
}

// ========================================
// 团队报表相关函数
// ========================================

// 加载团队报表
async function loadTeamReport(page = 1) {
  try {
    const startDate = document.getElementById('report-start-date')?.value || '';
    const endDate = document.getElementById('report-end-date')?.value || '';
    const search = document.getElementById('report-search')?.value || '';
    const type = document.getElementById('report-type')?.value || '';
    
    const result = await api(`/api/agent/team-report?page=${page}&start_date=${startDate}&end_date=${endDate}&search=${search}&type=${type}`);
    
    if (result.success) {
      const data = result.data;
      
      // 更新统计数据
      document.getElementById('team-total-members').textContent = data.summary.totalMembers;
      document.getElementById('team-total-performance').textContent = '¥' + formatMoney(data.summary.totalPerformance);
      document.getElementById('team-total-profit').textContent = '¥' + formatMoney(data.summary.totalProfit);
      document.getElementById('team-my-commission').textContent = '¥' + formatMoney(data.summary.myCommission);
      
      // 渲染表格
      const tbody = document.getElementById('team-report-table-body');
      if (data.list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-inbox text-4xl mb-2"></i>
              <div>暂无数据</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = data.list.map(item => `
        <tr class="border-t border-gray-700 hover:bg-gray-750">
          <td class="px-6 py-4">
            <div class="font-medium">${escapeHtml(item.username)}</div>
          </td>
          <td class="px-6 py-4">${escapeHtml(item.real_name || '-')}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 ${item.type === 'agent' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'} rounded text-sm">
              ${item.type === 'agent' ? '代理' : '会员'}
            </span>
          </td>
          <td class="px-6 py-4 text-gray-300">¥${formatMoney(item.total_bet)}</td>
          <td class="px-6 py-4 text-blue-400 font-semibold">¥${formatMoney(item.valid_bet)}</td>
          <td class="px-6 py-4">
            <span class="${item.profit >= 0 ? 'text-green-400' : 'text-red-400'} font-semibold">
              ¥${formatMoney(Math.abs(item.profit))}
            </span>
          </td>
          <td class="px-6 py-4 text-purple-400">${item.share_ratio}%</td>
          <td class="px-6 py-4 text-green-400 font-bold">¥${formatMoney(item.my_commission)}</td>
          <td class="px-6 py-4">
            <button onclick="viewReportDetail(${item.id}, '${item.type}')" class="text-blue-400 hover:text-blue-300">
              <i class="fas fa-eye mr-1"></i>详情
            </button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Load team report error:', error);
    showToast('加载团队报表失败', 'error');
  }
}

// 搜索团队报表
function searchTeamReport() {
  loadTeamReport(1);
}

// 导出团队报表
function exportTeamReport() {
  showToast('导出功能开发中...', 'info');
}

// 查看报表详情
function viewReportDetail(id, type) {
  showToast(`查看${type === 'agent' ? '代理' : '会员'}详情功能开发中...`, 'info');
}

// 显示新增代理弹窗
function showAddAgentModal() {
  showToast('新增代理功能开发中...', 'info');
}

// 显示新增会员弹窗
function showAddPlayerModal() {
  showToast('新增会员功能开发中...', 'info');
}

// ========================================
// 佣金明细相关函数
// ========================================

// 加载佣金明细
async function loadCommission(page = 1) {
  try {
    const startDate = document.getElementById('commission-start-date')?.value || '';
    const endDate = document.getElementById('commission-end-date')?.value || '';
    const search = document.getElementById('commission-search')?.value || '';
    const role = document.getElementById('commission-role')?.value || '';
    const status = document.getElementById('commission-status')?.value || '';
    
    const result = await api(`/api/agent/commission?page=${page}&start_date=${startDate}&end_date=${endDate}&search=${search}&role=${role}&status=${status}`);
    
    if (result.success) {
      const data = result.data;
      
      // 更新统计数据
      document.getElementById('commission-total').textContent = '¥' + formatMoney(data.summary.total);
      document.getElementById('commission-month').textContent = '¥' + formatMoney(data.summary.month);
      document.getElementById('commission-pending').textContent = '¥' + formatMoney(data.summary.pending);
      document.getElementById('commission-today').textContent = '¥' + formatMoney(data.summary.today);
      
      // 渲染表格
      const tbody = document.getElementById('commission-table-body');
      if (data.list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-inbox text-4xl mb-2"></i>
              <div>暂无数据</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = data.list.map(item => `
        <tr class="border-t border-gray-700 hover:bg-gray-750">
          <td class="px-6 py-4 text-gray-300">${formatDate(item.date)}</td>
          <td class="px-6 py-4">
            <div class="font-medium">${escapeHtml(item.target_username)}</div>
            <div class="text-sm text-gray-400">${escapeHtml(item.target_name || '-')}</div>
          </td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 ${item.target_type === 'agent' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'} rounded text-sm">
              ${item.target_type === 'agent' ? '下级代理' : '下级会员'}
            </span>
          </td>
          <td class="px-6 py-4 text-blue-400">¥${formatMoney(item.valid_bet)}</td>
          <td class="px-6 py-4">
            <span class="${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}">
              ¥${formatMoney(Math.abs(item.profit))}
            </span>
          </td>
          <td class="px-6 py-4 text-purple-400">${item.share_ratio}%</td>
          <td class="px-6 py-4 text-green-400 font-bold">¥${formatMoney(item.commission_amount)}</td>
          <td class="px-6 py-4">
            ${item.status === 'settled' 
              ? '<span class="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">已结算</span>'
              : '<span class="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-sm">待结算</span>'}
          </td>
          <td class="px-6 py-4">
            <button onclick="viewCommissionDetail(${item.id})" class="text-blue-400 hover:text-blue-300">
              <i class="fas fa-eye mr-1"></i>详情
            </button>
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Load commission error:', error);
    showToast('加载佣金明细失败', 'error');
  }
}

// 搜索佣金明细
function searchCommission() {
  loadCommission(1);
}

// 导出佣金明细
function exportCommission() {
  showToast('导出功能开发中...', 'info');
}

// 查看佣金详情
function viewCommissionDetail(id) {
  showToast('查看佣金详情功能开发中...', 'info');
}

// ========================================
// 账户设置相关函数
// ========================================

// 显示账户设置选项卡
function showAccountTab(tab) {
  // 更新选项卡样式
  document.querySelectorAll('.account-tab-btn').forEach(btn => {
    btn.classList.remove('border-primary');
    btn.classList.add('border-transparent');
  });
  document.querySelector(`[data-tab="${tab}"]`).classList.remove('border-transparent');
  document.querySelector(`[data-tab="${tab}"]`).classList.add('border-primary');
  
  // 渲染对应内容
  const content = document.getElementById('account-tab-content');
  
  switch(tab) {
    case 'profile':
      renderProfileTab();
      break;
    case 'password':
      renderPasswordTab();
      break;
    case 'logs':
      renderLogsTab();
      break;
  }
}

// 渲染个人信息选项卡
function renderProfileTab() {
  const content = document.getElementById('account-tab-content');
  content.innerHTML = `
    <div class="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <h3 class="text-xl font-semibold mb-6">
        <i class="fas fa-user-circle text-primary mr-2"></i>个人信息
      </h3>
      
      <form id="profile-form" onsubmit="updateProfile(event)" class="max-w-2xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">账号</label>
            <input type="text" value="${escapeHtml(currentUser.username)}" disabled
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400">
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">角色</label>
            <input type="text" value="${currentRole === 'shareholder' ? '股东' : '代理'}" disabled
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-400">
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">真实姓名 <span class="text-red-400">*</span></label>
            <input type="text" name="real_name" value="${escapeHtml(currentUser.real_name || '')}" required
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">联系电话 <span class="text-red-400">*</span></label>
            <input type="tel" name="phone" value="${escapeHtml(currentUser.phone || '')}" required
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm text-gray-400 mb-2">邮箱</label>
            <input type="email" name="email" value="${escapeHtml(currentUser.email || '')}"
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary">
          </div>
        </div>
        
        <div class="mt-8 flex items-center space-x-4">
          <button type="submit" class="bg-primary hover:bg-blue-700 px-8 py-3 rounded-lg transition font-semibold">
            <i class="fas fa-save mr-2"></i>保存修改
          </button>
          <button type="button" onclick="renderProfileTab()" class="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition">
            <i class="fas fa-undo mr-2"></i>重置
          </button>
        </div>
      </form>
    </div>
  `;
}

// 渲染修改密码选项卡
function renderPasswordTab() {
  const content = document.getElementById('account-tab-content');
  content.innerHTML = `
    <div class="bg-gray-800 rounded-xl p-8 border border-gray-700">
      <h3 class="text-xl font-semibold mb-6">
        <i class="fas fa-key text-primary mr-2"></i>修改密码
      </h3>
      
      <form id="password-form" onsubmit="updatePassword(event)" class="max-w-xl">
        <div class="space-y-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">当前密码 <span class="text-red-400">*</span></label>
            <input type="password" name="old_password" required
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                   placeholder="请输入当前密码">
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">新密码 <span class="text-red-400">*</span></label>
            <input type="password" name="new_password" required minlength="6"
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                   placeholder="请输入新密码（至少6位）">
            <div class="text-sm text-gray-400 mt-2">
              <i class="fas fa-info-circle mr-1"></i>密码长度至少6位，建议包含字母、数字和特殊字符
            </div>
          </div>
          
          <div>
            <label class="block text-sm text-gray-400 mb-2">确认新密码 <span class="text-red-400">*</span></label>
            <input type="password" name="confirm_password" required minlength="6"
                   class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                   placeholder="请再次输入新密码">
          </div>
        </div>
        
        <div class="mt-8 flex items-center space-x-4">
          <button type="submit" class="bg-primary hover:bg-blue-700 px-8 py-3 rounded-lg transition font-semibold">
            <i class="fas fa-check mr-2"></i>确认修改
          </button>
          <button type="reset" class="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition">
            <i class="fas fa-undo mr-2"></i>重置
          </button>
        </div>
      </form>
    </div>
  `;
}

// 渲染登录日志选项卡
function renderLogsTab() {
  const content = document.getElementById('account-tab-content');
  content.innerHTML = `
    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold">
          <i class="fas fa-history text-primary mr-2"></i>登录日志
        </h3>
        <div class="flex items-center space-x-4">
          <input type="date" id="log-start-date" class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          <input type="date" id="log-end-date" class="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
          <button onclick="searchLogs()" class="bg-primary hover:bg-blue-700 px-4 py-2 rounded-lg transition">
            <i class="fas fa-search mr-2"></i>查询
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold">登录时间</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">IP地址</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">设备信息</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">登录方式</th>
              <th class="px-6 py-4 text-left text-sm font-semibold">状态</th>
            </tr>
          </thead>
          <tbody id="login-logs-table-body">
            <tr>
              <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <div>加载中...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div id="logs-pagination" class="mt-6 flex items-center justify-between">
        <!-- 动态渲染 -->
      </div>
    </div>
  `;
  
  // 设置默认日期（最近30天）
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  document.getElementById('log-start-date').value = thirtyDaysAgo.toISOString().split('T')[0];
  document.getElementById('log-end-date').value = today.toISOString().split('T')[0];
  
  loadLoginLogs();
}

// 更新个人信息
async function updateProfile(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  try {
    const result = await api('/api/agent/profile', {
      method: 'PUT',
      body: JSON.stringify({
        real_name: formData.get('real_name'),
        phone: formData.get('phone'),
        email: formData.get('email')
      })
    });
    
    if (result.success) {
      showToast('个人信息更新成功', 'success');
      currentUser.real_name = formData.get('real_name');
      currentUser.phone = formData.get('phone');
      currentUser.email = formData.get('email');
    } else {
      showToast(result.error || '更新失败', 'error');
    }
  } catch (error) {
    console.error('Update profile error:', error);
    showToast('更新失败，请稍后重试', 'error');
  }
}

// 修改密码
async function updatePassword(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  const newPassword = formData.get('new_password');
  const confirmPassword = formData.get('confirm_password');
  
  if (newPassword !== confirmPassword) {
    showToast('两次输入的新密码不一致', 'error');
    return;
  }
  
  try {
    const result = await api('/api/agent/password', {
      method: 'PUT',
      body: JSON.stringify({
        old_password: formData.get('old_password'),
        new_password: newPassword
      })
    });
    
    if (result.success) {
      showToast('密码修改成功，请重新登录', 'success');
      setTimeout(() => {
        handleLogout();
      }, 2000);
    } else {
      showToast(result.error || '修改失败', 'error');
    }
  } catch (error) {
    console.error('Update password error:', error);
    showToast('修改失败，请稍后重试', 'error');
  }
}

// 加载登录日志
async function loadLoginLogs(page = 1) {
  try {
    const startDate = document.getElementById('log-start-date')?.value || '';
    const endDate = document.getElementById('log-end-date')?.value || '';
    
    const result = await api(`/api/agent/login-logs?page=${page}&start_date=${startDate}&end_date=${endDate}`);
    
    if (result.success) {
      const tbody = document.getElementById('login-logs-table-body');
      const data = result.data;
      
      if (data.list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              <i class="fas fa-inbox text-4xl mb-2"></i>
              <div>暂无登录记录</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = data.list.map(item => `
        <tr class="border-t border-gray-700 hover:bg-gray-750">
          <td class="px-6 py-4 text-gray-300">${formatDate(item.login_time)}</td>
          <td class="px-6 py-4 font-mono text-blue-400">${escapeHtml(item.ip_address)}</td>
          <td class="px-6 py-4 text-sm text-gray-400">${escapeHtml(item.user_agent || '-')}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 bg-blue-900 text-blue-300 rounded text-sm">
              ${item.login_type || '密码登录'}
            </span>
          </td>
          <td class="px-6 py-4">
            ${item.status === 'success' 
              ? '<span class="px-2 py-1 bg-green-900 text-green-300 rounded text-sm"><i class="fas fa-check mr-1"></i>成功</span>'
              : '<span class="px-2 py-1 bg-red-900 text-red-300 rounded text-sm"><i class="fas fa-times mr-1"></i>失败</span>'}
          </td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Load login logs error:', error);
    showToast('加载登录日志失败', 'error');
  }
}

// 搜索登录日志
function searchLogs() {
  loadLoginLogs(1);
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否已登录
  const token = localStorage.getItem('agent_token');
  if (token) {
    // 验证token有效性
    api('/api/agent/verify').then(result => {
      if (result.success) {
        currentUser = result.data.user;
        currentRole = result.data.user.role;
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        initMainPage();
      }
    });
  }
});
