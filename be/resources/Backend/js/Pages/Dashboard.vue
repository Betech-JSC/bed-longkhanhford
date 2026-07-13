<template>
    <Head title="Tổng quan" />

    <div class="dashboard-wrapper">
        <!-- Header -->
        <div class="dashboard-header">
            <div class="header-content">
                <h1 class="header-title">Hệ Thống Quản Trị Ford Longkhanhford</h1>
                <p class="header-date">{{ currentDate }}</p>
            </div>
            <div class="header-badge">
                <span class="badge-dot"></span>
                <span>Live</span>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <!-- Yêu cầu đặt cọc xe -->
            <div class="stat-card stat-card--indigo">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Yêu cầu đặt cọc xe</div>
                    <div class="stat-card__value">{{ todayOrderCount }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--new"></span>
                        <span>{{ newOrderCount }} yêu cầu mới chờ duyệt</span>
                    </div>
                </div>
            </div>

            <!-- Tiền cọc hôm nay -->
            <div class="stat-card stat-card--emerald">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6v2m0 8v2M9 12h6m-6 0a3 3 0 106 0 3 3 0 00-6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Tiền đặt cọc nhận hôm nay</div>
                    <div class="stat-card__value">{{ formattedRevenue }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--green"></span>
                        <span>Tổng tiền cọc nhận trong ngày</span>
                    </div>
                </div>
            </div>

            <!-- Liên hệ hỗ trợ -->
            <div class="stat-card stat-card--rose">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Yêu cầu liên hệ / gọi lại</div>
                    <div class="stat-card__value">{{ todayContactCount }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--red"></span>
                        <span>{{ newContactCount }} liên hệ chưa xử lý</span>
                    </div>
                </div>
            </div>

            <!-- Yêu cầu tư vấn xe -->
            <div class="stat-card stat-card--amber">
                <div class="stat-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="stat-card__body">
                    <div class="stat-card__label">Yêu cầu tư vấn xe</div>
                    <div class="stat-card__value">{{ todayAdviseCount }}</div>
                    <div class="stat-card__sub">
                        <span class="dot dot--yellow"></span>
                        <span>{{ newAdviseCount }} yêu cầu tư vấn mới</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-grid">
            <div class="chart-card">
                <div class="chart-card__header">
                    <h3 class="chart-card__title">
                        <svg viewBox="0 0 24 24" fill="none" class="chart-icon chart-icon--indigo" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM10 11a1 1 0 011-1h2a1 1 0 011 1v8a1 1 0 01-1 1h-2a1 1 0 01-1-1v-8zM16 15a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Thống Kê Yêu Cầu Gửi Đến Tuần Qua
                    </h3>
                </div>
                <div class="chart-card__body">
                    <div class="chart-wrapper">
                        <canvas ref="weeklyChartCanvas"></canvas>
                    </div>
                </div>
            </div>

            <div class="chart-card">
                <div class="chart-card__header">
                    <h3 class="chart-card__title">
                        <svg viewBox="0 0 24 24" fill="none" class="chart-icon chart-icon--emerald" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Cơ Cấu Phân Loại Yêu Cầu
                    </h3>
                </div>
                <div class="chart-card__body">
                    <div class="chart-wrapper">
                        <canvas ref="distributionChartCanvas"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Row -->
        <div class="summary-grid">
            <!-- Tổng kết liên hệ & Tuyển dụng -->
            <div class="summary-card">
                <div class="summary-card__header">
                    <h2 class="summary-card__title">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="summary-icon summary-icon--rose">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        Khách Hàng &amp; Tuyển Dụng
                    </h2>
                </div>
                <div class="summary-card__body">
                    <div class="summary-row">
                        <span class="summary-label">Yêu cầu gọi lại hôm nay</span>
                        <span class="summary-value summary-value--rose">{{ todayContactCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Yêu cầu gọi lại chưa xử lý</span>
                        <span class="summary-value summary-value--rose">{{ newContactCount }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span class="summary-label">Hồ sơ ứng tuyển hôm nay</span>
                        <span class="summary-value summary-value--amber">{{ todayApplyCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Hồ sơ ứng tuyển chưa duyệt</span>
                        <span class="summary-value summary-value--amber">{{ newApplyCount }}</span>
                    </div>
                </div>
                <div class="summary-card__footer">
                    <a :href="route('admin.contacts.index')" class="summary-link summary-link--rose">
                        Quản lý liên hệ khách hàng →
                    </a>
                </div>
            </div>

            <!-- Tổng kết đặt cọc xe & tư vấn -->
            <div class="summary-card">
                <div class="summary-card__header">
                    <h2 class="summary-card__title">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="summary-icon summary-icon--indigo">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                        </svg>
                        Đơn Đặt Cọc &amp; Tư Vấn Xe
                    </h2>
                </div>
                <div class="summary-card__body">
                    <div class="summary-row">
                        <span class="summary-label">Đơn đặt cọc mới</span>
                        <span class="summary-value summary-value--indigo">{{ newOrderCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Yêu cầu tư vấn xe chưa xem</span>
                        <span class="summary-value summary-value--amber">{{ newAdviseCount }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span class="summary-label">Doanh thu cọc xe hôm nay</span>
                        <span class="summary-value summary-value--emerald">{{ formattedRevenue }}</span>
                    </div>
                </div>
                <div class="summary-card__footer">
                    <a :href="(route().has('vi.admin.orders.index') || route().has('admin.orders.index')) ? route('admin.orders.index') : '#'" class="summary-link summary-link--indigo">
                        Quản lý danh sách đặt cọc xe →
                    </a>
                </div>
            </div>

            <!-- Tổng kết Đặt hẹn dịch vụ & Khảo sát -->
            <div class="summary-card">
                <div class="summary-card__header">
                    <h2 class="summary-card__title">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="summary-icon summary-icon--rose" style="color: #0562d2;">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                        </svg>
                        Đặt Hẹn Dịch Vụ &amp; Khảo Sát
                    </h2>
                </div>
                <div class="summary-card__body">
                    <div class="summary-row">
                        <span class="summary-label">Đặt hẹn dịch vụ hôm nay</span>
                        <span class="summary-value summary-value--indigo" style="color: #0562d2;">{{ todayServiceBookingCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Đặt hẹn dịch vụ chưa xử lý</span>
                        <span class="summary-value summary-value--rose">{{ newServiceBookingCount }}</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row">
                        <span class="summary-label">Khảo sát lái thử chưa đọc</span>
                        <span class="summary-value summary-value--amber">{{ newTestDriveSurveyCount }}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Khảo sát dịch vụ chưa đọc</span>
                        <span class="summary-value summary-value--amber">{{ newServiceSurveyCount }}</span>
                    </div>
                </div>
                <div class="summary-card__footer">
                    <a :href="route('admin.service-bookings.index')" class="summary-link summary-link--rose" style="color: #0562d2;">
                        Quản lý đặt hẹn dịch vụ →
                    </a>
                </div>
            </div>
        </div>

        <!-- Tài nguyên hệ thống -->
        <div class="summary-grid" style="margin-top: 24px;">
            <div class="summary-card" style="grid-column: span 2;">
                <div class="summary-card__header">
                    <h2 class="summary-card__title">
                        <svg viewBox="0 0 20 20" fill="currentColor" class="summary-icon summary-icon--emerald" style="color: #059669;">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                        </svg>
                        Thống Kê Tài Nguyên Ford Longkhanhford
                    </h2>
                </div>
                <div class="summary-card__body" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div class="summary-row" style="border-right: 1px solid #f3f4f6; padding-right: 20px;">
                        <span class="summary-label" style="font-size: 16px; font-weight: 500;">Tổng số sản phẩm xe trong kho</span>
                        <span class="summary-value summary-value--indigo" style="font-size: 24px;">{{ totalVehiclesCount }} xe</span>
                    </div>
                    <div class="summary-row" style="padding-left: 20px;">
                        <span class="summary-label" style="font-size: 16px; font-weight: 500;">Tổng số bài viết tin tức &amp; thị trường</span>
                        <span class="summary-value summary-value--emerald" style="font-size: 24px; color: #059669;">{{ totalPostsCount }} bài</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Head } from '@inertiajs/inertia-vue3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
    components: {
        Head,
    },
    computed: {
        currentDate() {
            return new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        },
        todayContactCount() {
            return this.$page.props.data.today_contact_count ?? 0
        },
        todayServiceBookingCount() {
            return this.$page.props.data.today_service_booking_count ?? 0
        },
        todayApplyCount() {
            return this.$page.props.data.today_apply_count ?? 0
        },
        todayAdviseCount() {
            return this.$page.props.data.today_advise_count ?? 0
        },
        newContactCount() {
            return this.$page.props.data.new_contact_count ?? 0
        },
        newServiceBookingCount() {
            return this.$page.props.data.new_service_booking_count ?? 0
        },
        newTestDriveSurveyCount() {
            return this.$page.props.data.new_test_drive_survey_count ?? 0
        },
        newServiceSurveyCount() {
            return this.$page.props.data.new_service_survey_count ?? 0
        },
        newApplyCount() {
            return this.$page.props.data.new_apply_count ?? 0
        },
        newAdviseCount() {
            return this.$page.props.data.new_advise_count ?? 0
        },
        todayOrderCount() {
            return this.$page.props.data.today_order_count ?? 0
        },
        newOrderCount() {
            return this.$page.props.data.new_order_count ?? 0
        },
        todayOrderTotalPrice() {
            return this.$page.props.data.today_order_total_price ?? 0
        },
        totalVehiclesCount() {
            return this.$page.props.data.total_vehicles_count ?? 0
        },
        totalPostsCount() {
            return this.$page.props.data.total_posts_count ?? 0
        },
        formattedRevenue() {
            if (!this.todayOrderTotalPrice) return '0 ₫'
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
            }).format(this.todayOrderTotalPrice)
        },
    },
    data() {
        return {
            weeklyChart: null,
            distributionChart: null,
        }
    },
    mounted() {
        this.initWeeklyChart()
        this.initDistributionChart()
    },
    beforeUnmount() {
        if (this.weeklyChart) this.weeklyChart.destroy()
        if (this.distributionChart) this.distributionChart.destroy()
    },
    methods: {
        initWeeklyChart() {
            const ctx = this.$refs.weeklyChartCanvas
            if (!ctx) return

            const stats = this.$page.props.data.weekly_stats || []
            const labels = stats.map(item => item.date)
            const adviseData = stats.map(item => item.advise)
            const contactData = stats.map(item => item.contact)
            const applyData = stats.map(item => item.apply)

            this.weeklyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Tư vấn xe',
                            data: adviseData,
                            backgroundColor: '#fbbf24', // Amber
                            borderRadius: 6,
                        },
                        {
                            label: 'Liên hệ',
                            data: contactData,
                            backgroundColor: '#f43f5e', // Rose
                            borderRadius: 6,
                        },
                        {
                            label: 'Tuyển dụng',
                            data: applyData,
                            backgroundColor: '#10b981', // Emerald
                            borderRadius: 6,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                }
                            }
                        },
                        tooltip: {
                            padding: 12,
                            cornerRadius: 8,
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0,
                                stepSize: 1,
                            }
                        }
                    }
                }
            })
        },
        initDistributionChart() {
            const ctx = this.$refs.distributionChartCanvas
            if (!ctx) return

            const dist = this.$page.props.data.type_distribution || { contact: 0, apply: 0, advise: 0 }
            
            this.distributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Tư vấn xe', 'Liên hệ', 'Tuyển dụng'],
                    datasets: [{
                        data: [dist.advise, dist.contact, dist.apply],
                        backgroundColor: [
                            '#fbbf24', // Amber
                            '#f43f5e', // Rose
                            '#10b981', // Emerald
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12,
                                }
                            }
                        },
                        tooltip: {
                            padding: 12,
                            cornerRadius: 8,
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.dashboard-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Header */
.dashboard-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
}

.header-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 4px;
}

.header-date {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    text-transform: capitalize;
}

.header-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ecfdf5;
    color: #059669;
    font-size: 13px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid #a7f3d0;
}

.badge-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
}

@media (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    border: 1px solid #f3f4f6;
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.07);
}

.stat-card__icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-card__icon svg {
    width: 24px;
    height: 24px;
}

.stat-card--indigo .stat-card__icon {
    background: #eef2ff;
    color: #4f46e5;
}

.stat-card--emerald .stat-card__icon {
    background: #ecfdf5;
    color: #059669;
}

.stat-card--rose .stat-card__icon {
    background: #fff1f2;
    color: #e11d48;
}

.stat-card--amber .stat-card__icon {
    background: #fffbeb;
    color: #d97706;
}

.stat-card__label {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 6px;
}

.stat-card__value {
    font-size: 30px;
    font-weight: 700;
    color: #111827;
    line-height: 1;
    margin-bottom: 10px;
}

.stat-card--indigo .stat-card__value { color: #4f46e5; }
.stat-card--emerald .stat-card__value { color: #059669; }
.stat-card--rose .stat-card__value { color: #e11d48; }
.stat-card--amber .stat-card__value { color: #d97706; }

.stat-card__sub {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
}

.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.dot--new { background: #4f46e5; }
.dot--green { background: #10b981; }
.dot--red { background: #e11d48; }
.dot--yellow { background: #f59e0b; }

/* Summary Grid */
.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

@media (max-width: 1024px) {
    .summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .summary-grid {
        grid-template-columns: 1fr;
    }
}

.summary-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    border: 1px solid #f3f4f6;
    overflow: hidden;
}

.summary-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;
    background: #fafafa;
}

.summary-card__title {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.summary-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.summary-icon--rose { color: #e11d48; }
.summary-icon--indigo { color: #4f46e5; }

.summary-card__body {
    padding: 20px;
}

.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
}

.summary-label {
    font-size: 14px;
    color: #6b7280;
}

.summary-value {
    font-size: 18px;
    font-weight: 700;
    min-width: 50px;
    text-align: right;
}

.summary-value--rose { color: #e11d48; }
.summary-value--amber { color: #d97706; }
.summary-value--indigo { color: #4f46e5; }
.summary-value--emerald { color: #059669; }

.summary-divider {
    height: 1px;
    background: #f3f4f6;
    margin: 8px 0;
}

.summary-card__footer {
    padding: 14px 20px;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
}

.summary-link {
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.15s;
}

.summary-link:hover {
    opacity: 0.7;
}

.summary-link--rose { color: #e11d48; }
.summary-link--indigo { color: #4f46e5; }

/* Charts Grid */
.charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
}

@media (max-width: 992px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}

.chart-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
    border: 1px solid #f3f4f6;
    overflow: hidden;
}

.chart-card__header {
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;
    background: #fafafa;
}

.chart-card__title {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.chart-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}

.chart-icon--indigo { color: #4f46e5; }
.chart-icon--emerald { color: #059669; }

.chart-card__body {
    padding: 24px;
}

.chart-wrapper {
    position: relative;
    height: 320px;
    width: 100%;
}
</style>
