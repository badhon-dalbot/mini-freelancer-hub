console.log(localStorage);

const dashboardName = new URLSearchParams(window.location.search).get('name') || 'Sayed Hasan Sami';
const lastName = dashboardName.trim().split(' ')[2] || 'Sami';

const dashboardState = {
    stats: [
        { icon: '∣∣', tone: 'violet', label: 'Total income', value: 1080, action: 'Refresh' },
        { icon: '⌂', tone: 'green', label: 'Withdraw requested', value: 0, action: 'Show all invoices' },
        { icon: '▭', tone: 'pink', label: 'Pending income', value: 0, action: 'Refresh' },
        { icon: '⌁', tone: 'orange', label: 'Available in account', value: 1080, action: 'Withdraw now' }
    ],
    overviewCards: [
        { badge: 'success', badgeLabel: 'Completed', value: '1', label: 'Completed projects' },
        { badge: 'warning', badgeLabel: 'Ongoing', value: '1', label: 'Ongoing projects' },
        { badge: 'danger', badgeLabel: 'Cancelled', value: '0', label: 'Cancelled projects' },
        { badge: 'brand', badgeLabel: 'Tasks sold', value: '2', label: 'Tasks sold' },
        { badge: 'warning', badgeLabel: 'Ongoing', value: '0', label: 'Ongoing tasks' },
        { badge: 'danger', badgeLabel: 'Cancelled', value: '1', label: 'Cancelled tasks' }
    ],
    payouts: [
        { label: 'Bkash', icon: 'B', tone: 'blue' },
        { label: 'Nagad', icon: 'N', tone: 'orange' },
        { label: 'Setup bank account', icon: 'B', tone: 'gray' }
    ],
    charts: {
        weekly: {
            label: 'Weekly',
            values: [0.12, 0.15, 0.55, 0.48, 0.68, 0.64, 0.79, 0.76, 0.92, 0.9]
        },
        monthly: {
            label: 'Monthly',
            values: [0.18, 0.22, 0.3, 0.42, 0.56, 0.5, 0.62, 0.66, 0.71, 0.75, 0.83, 0.92]
        },
        yearly: {
            label: 'Yearly',
            values: [0.16, 0.24, 0.33, 0.45, 0.54, 0.61, 0.69, 0.76, 0.84, 0.9, 0.97, 1]
        }
    }
};

const statsRow = document.getElementById('statsRow');
const overviewCards = document.getElementById('overviewCards');
const payoutList = document.getElementById('payoutList');
const chartFilters = document.getElementById('chartFilters');
const earningsChart = document.getElementById('earningsChart');
const sidebarName = document.getElementById('sidebarName');
const sidebarAvatar = document.getElementById('sidebarAvatar');
const greetingTitle = document.getElementById('greetingTitle');
const greetingText = document.getElementById('greetingText');

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 18) {
        return 'Good afternoon';
    }

    return 'Good evening';
}

function renderStats() {
    statsRow.innerHTML = dashboardState.stats.map(function (stat) {
        return `
            <article class="stat_card">
                <div class="stat_icon ${stat.tone}">${stat.icon}</div>
                <p class="stat_label">${stat.label}</p>
                <p class="stat_value">${formatCurrency(stat.value)}</p>
                <p class="stat_action">${stat.action}</p>
            </article>
        `;
    }).join('');
}

function renderOverviewCards() {
    overviewCards.innerHTML = dashboardState.overviewCards.map(function (card) {
        return `
            <article class="overview_card">
                <div class="overview_top_row">
                    <span class="overview_badge ${card.badge}">${card.badgeLabel}</span>
                    <button class="overview_view" type="button">View</button>
                </div>
                <p class="overview_value">${card.value}</p>
                <p class="overview_label">${card.label}</p>
            </article>
        `;
    }).join('');
}

function renderPayouts() {
    payoutList.innerHTML = dashboardState.payouts.map(function (item) {
        return `
            <button class="payout_item" type="button">
                <span class="payout_left">
                    <span class="payout_icon ${item.tone}">${item.icon}</span>
                    <span>${item.label}</span>
                </span>
                <span>›</span>
            </button>
        `;
    }).join('');
}

function buildLinePath(values, width, height, padding) {
    const chartWidth = width - (padding.left + padding.right);
    const chartHeight = height - (padding.top + padding.bottom);
    const highestValue = Math.max.apply(null, values);
    const lowestValue = Math.min.apply(null, values);
    const range = Math.max(highestValue - lowestValue, 0.25);
    const step = chartWidth / Math.max(values.length - 1, 1);

    return values.map(function (value, index) {
        const x = padding.left + step * index;
        const normalized = (value - lowestValue) / range;
        const y = padding.top + chartHeight - (normalized * chartHeight);

        return { x: x, y: y };
    });
}

function renderChart(filterKey) {
    if (!earningsChart) {
        return;
    }

    const chartData = dashboardState.charts[filterKey] || dashboardState.charts.weekly;
    const width = 960;
    const height = 280;
    const padding = { top: 22, right: 24, bottom: 34, left: 42 };
    const points = buildLinePath(chartData.values, width, height, padding);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const areaPath = [
        `M ${firstPoint.x} ${height - padding.bottom}`,
        `L ${firstPoint.x} ${firstPoint.y}`,
        points.slice(1).map(function (point) {
            return `L ${point.x} ${point.y}`;
        }).join(' '),
        `L ${lastPoint.x} ${height - padding.bottom}`,
        'Z'
    ].join(' ');

    const linePath = points.map(function (point, index) {
        return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ');

    const gridLines = [0.15, 0.35, 0.55, 0.75, 0.95].map(function (ratio) {
        const y = padding.top + (height - padding.top - padding.bottom) * ratio;

        return `<line class="chart_grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>`;
    }).join('');

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const labelStep = (width - padding.left - padding.right) / Math.max(labels.length - 1, 1);
    const axisLabels = labels.map(function (label, index) {
        const x = padding.left + labelStep * index;

        return `<text class="chart_axis_label" x="${x}" y="${height - 8}" text-anchor="middle">${label}</text>`;
    }).join('');

    const valueLabels = ['$0', '$0.2', '$0.4', '$0.6', '$0.8', '$1.0', '$1.2'].map(function (label, index) {
        const y = height - padding.bottom - ((height - padding.top - padding.bottom) / 6) * index;

        return `<text class="chart_axis_label" x="${padding.left - 10}" y="${y + 4}" text-anchor="end">${label}</text>`;
    }).join('');

    const dots = points.map(function (point) {
        return `<circle class="chart_point" cx="${point.x}" cy="${point.y}" r="5"></circle>`;
    }).join('');

    earningsChart.innerHTML = `
        ${gridLines}
        ${valueLabels}
        <path class="chart_area" d="${areaPath}"></path>
        <path class="chart_line" d="${linePath}"></path>
        ${dots}
        ${axisLabels}
    `;
}

function renderFilters(activeKey) {
    if (!chartFilters) {
        return;
    }

    chartFilters.innerHTML = Object.keys(dashboardState.charts).map(function (key) {
        const isActive = key === activeKey;

        return `<button class="chart_filter ${isActive ? 'active' : ''}" type="button" data-chart-key="${key}">${dashboardState.charts[key].label}</button>`;
    }).join('');
}

function setGreeting() {
    sidebarName.textContent = dashboardName;
    sidebarAvatar.textContent = dashboardName
        .split(' ')
        .map(function (part) {
            return part.charAt(0);
        })
        .join('')
        .slice(0, 3)
        .toUpperCase();

    greetingTitle.textContent = `${getGreeting()}, ${lastName} 👋`;
    greetingText.textContent = 'Here is what is happening with your account today.';
}

function setupSidebarMenuToggle() {
    const sidebarGroupButton = document.querySelector('.sidebar_group_button');

    if (!sidebarGroupButton) {
        return;
    }

    const sidebarGroup = sidebarGroupButton.closest('.sidebar_group');
    const sidebarSubmenu = sidebarGroup ? sidebarGroup.querySelector('.sidebar_submenu') : null;

    if (!sidebarGroup || !sidebarSubmenu) {
        return;
    }

    sidebarGroupButton.addEventListener('click', function () {
        const isExpanded = sidebarGroupButton.getAttribute('aria-expanded') === 'true';

        sidebarGroupButton.setAttribute('aria-expanded', String(!isExpanded));
        sidebarGroup.classList.toggle('is-open', !isExpanded);
        sidebarSubmenu.hidden = isExpanded;
    });
}

setGreeting();
setupSidebarMenuToggle();
renderStats();
renderOverviewCards();
renderPayouts();
if (chartFilters && earningsChart) {
    renderFilters('weekly');
    renderChart('weekly');

    chartFilters.addEventListener('click', function (event) {
        const button = event.target.closest('[data-chart-key]');

        if (!button) {
            return;
        }

        const chartKey = button.getAttribute('data-chart-key');

        renderFilters(chartKey);
        renderChart(chartKey);
    });
}