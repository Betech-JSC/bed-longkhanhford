<template>
    <span class="hidden">
        {{ $page.props.route.name }}
    </span>

    <!-- ===== QUẢN LÝ SẢN PHẨM ===== -->
    <div class="item-group-label">Quản lý Sản phẩm</div>
    
    <Link v-if="can('admin.vehicle-categories.index')" :href="route('admin.vehicle-categories.index')"
        :class="{ active: isUrl('admin.vehicle-categories.*') }" class="item">
        <bx:category />
        <span>Danh mục xe</span>
    </Link>
    
    <Link v-if="can('admin.vehicles.index')" :href="route('admin.vehicles.index')"
        :class="{ active: isUrl('admin.vehicles.*') }" class="item">
        <fluent-mdl2:product-list />
        <span>Sản phẩm xe</span>
    </Link>
    
    <Link v-if="can('admin.used-vehicles.index')" :href="route('admin.used-vehicles.index')"
        :class="{ active: isUrl('admin.used-vehicles.*') }" class="item">
        <ph:car-light />
        <span>Xe đã qua sử dụng</span>
    </Link>
    
    <Link v-if="can('admin.accessory-categories.index')" :href="route('admin.accessory-categories.index')"
        :class="{ active: isUrl('admin.accessory-categories.*') }" class="item">
        <bx:category />
        <span>Danh mục phụ kiện</span>
    </Link>
    
    <Link v-if="can('admin.accessories.index')" :href="route('admin.accessories.index')"
        :class="{ active: isUrl('admin.accessories.*') }" class="item">
        <ph:wrench-light />
        <span>Phụ kiện</span>
    </Link>

    <Link v-if="can('admin.brands.index')" :href="route('admin.brands.index')"
        :class="{ active: isUrl('admin.brands.*') }" class="item">
        <ph:tag-light />
        <span>Hãng xe</span>
    </Link>

    <Link v-if="can('admin.maintenance-schedules.index')" :href="route('admin.maintenance-schedules.index')"
        :class="{ active: isUrl('admin.maintenance-schedules.*') }" class="item">
        <ph:calendar-blank-light />
        <span>Lịch bảo dưỡng</span>
    </Link>

    <Link v-if="can('admin.registration-fees.index')" :href="route('admin.registration-fees.index')"
        :class="{ active: isUrl('admin.registration-fees.*') }" class="item">
        <ph:currency-circle-dollar-light />
        <span>Thuế phí & Biển số</span>
    </Link>

    <!-- ===== QUẢN LÝ NỘI DUNG ===== -->
    <div class="item-group-label">Quản lý Nội dung</div>

    <Link v-if="can('admin.post-categories.index')" :href="route('admin.post-categories.index')"
        :class="{ active: isUrl('admin.post-categories.*') }" class="item">
        <bx:category />
        <span>Danh mục bài viết</span>
    </Link>
    
    <Link v-if="can('admin.posts.index')" :href="route('admin.posts.index')" :class="{ active: isUrl('admin.posts.*') }"
        class="item">
        <ph-newspaper-clipping-light />
        <span>Bài viết</span>
    </Link>

    <Link v-if="can('admin.services.index')" :href="route('admin.services.index')"
        :class="{ active: isUrl('admin.services.*') }" class="item">
        <ph:wrench-light />
        <span>Dịch vụ</span>
    </Link>
    
    <Link v-if="can('admin.policies.index')" :href="route('admin.policies.index')"
        :class="{ active: isUrl('admin.policies.*') }" class="item">
        <ph:shield-check-light />
        <span>Chính sách điều khoản</span>
    </Link>
    
    <Link v-if="can('admin.dealer-activities.index')" :href="route('admin.dealer-activities.index')"
        :class="{ active: isUrl('admin.dealer-activities.*') }" class="item">
        <ph:image-light />
        <span>Hoạt động đại lý</span>
    </Link>

    <Link v-if="can('admin.customer-handovers.index')" :href="route('admin.customer-handovers.index')"
        :class="{ active: isUrl('admin.customer-handovers.*') }" class="item">
        <ph:heart-light />
        <span>Tri ân khách hàng</span>
    </Link>

    <Link v-if="can('admin.media.index')" :href="route('admin.media.index')"
        :class="{ active: isUrl('admin.media.*') }" class="item">
        <ph-video-camera-light />
        <span>Quản lý Media</span>
    </Link>

    <!-- ===== KHÁCH HÀNG & CRM ===== -->
    <div class="item-group-label">Khách hàng & CRM</div>

    <Link v-if="can('admin.contacts.index')" :href="route('admin.contacts.index')"
        :class="{ active: isUrl('admin.contacts.*') }" class="item">
        <material-symbols:connect-without-contact />
        <span>Yêu cầu liên hệ</span>
        <span v-if="newContact" class="badge badge-danger ml-auto">{{ newContact }}</span>
    </Link>

    <Link v-if="can('admin.repair-quotes.index')" :href="route('admin.repair-quotes.index')"
        :class="{ active: isUrl('admin.repair-quotes.*') }" class="item">
        <ph:clipboard-text-light />
        <span>Báo giá sửa chữa</span>
        <span v-if="newRepairQuote" class="badge badge-danger ml-auto">{{ newRepairQuote }}</span>
    </Link>

    <Link v-if="can('admin.service-bookings.index')" :href="route('admin.service-bookings.index')"
        :class="{ active: isUrl('admin.service-bookings.*') }" class="item">
        <ph:calendar-blank-light />
        <span>Đặt hẹn dịch vụ</span>
        <span v-if="newServiceBooking" class="badge badge-danger ml-auto">{{ newServiceBooking }}</span>
    </Link>

    <Link v-if="can('admin.test-drive-surveys.index')" :href="route('admin.test-drive-surveys.index')"
        :class="{ active: isUrl('admin.test-drive-surveys.*') }" class="item">
        <ph:clipboard-text-light />
        <span>Khảo sát lái thử</span>
        <span v-if="newTestDriveSurvey" class="badge badge-danger ml-auto">{{ newTestDriveSurvey }}</span>
    </Link>

    <Link v-if="can('admin.service-surveys.index')" :href="route('admin.service-surveys.index')"
        :class="{ active: isUrl('admin.service-surveys.*') }" class="item">
        <ph:clipboard-light />
        <span>Khảo sát dịch vụ</span>
        <span v-if="newServiceSurvey" class="badge badge-danger ml-auto">{{ newServiceSurvey }}</span>
    </Link>
    
    <Link v-if="can('admin.chat-sessions.index')" :href="route('admin.chat-sessions.index')"
        :class="{ active: isUrl('admin.chat-sessions.*') }" class="item">
        <ph:chat-teardrop-dots-light />
        <span>Quản lý Chat AI</span>
    </Link>
    
    <Link v-if="can('admin.customer-reviews.index')" :href="route('admin.customer-reviews.index')"
        :class="{ active: isUrl('admin.customer-reviews.*') }" class="item">
        <ph:star-light />
        <span>Ý kiến khách hàng</span>
    </Link>
    
    <Link v-if="can('admin.sales-consultants.index')" :href="route('admin.sales-consultants.index')"
        :class="{ active: isUrl('admin.sales-consultants.*') }" class="item">
        <ph:users-three-light />
        <span>Đội ngũ tư vấn</span>
    </Link>

    <!-- ===== TIỆN ÍCH MARKETING ===== -->
    <div class="item-group-label">Tiện ích Marketing</div>

    <Link v-if="can('admin.banners.index')" :href="route('admin.banners.index')"
        :class="{ active: isUrl('admin.banners.*') }" class="item">
        <bi:collection-play />
        <span>Banner quảng cáo</span>
    </Link>

    <Link v-if="can('admin.partners.index')" :href="route('admin.partners.index')"
        :class="{ active: isUrl('admin.partners.*') }" class="item">
        <bi:building />
        <span>Đối tác</span>
    </Link>

    <Link v-if="can('admin.awards.index')" :href="route('admin.awards.index')"
        :class="{ active: isUrl('admin.awards.*') }" class="item">
        <ph:medal-light />
        <span>Giải thưởng</span>
    </Link>

    <!-- ===== HỆ THỐNG & HƯỚNG DẪN ===== -->
    <div class="item-group-label">Hệ thống & Hướng dẫn</div>

    <Link v-if="can('admin.cms-manuals.index')" :href="route('admin.cms-manuals.index')"
        :class="{ active: isUrl('admin.cms-manuals.*') }" class="item">
        <ph:book-open-light />
        <span>Hướng dẫn sử dụng</span>
    </Link>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    computed: {
        newContact() {
            return this.$page.props.data.new_contact_count
        },
        newRepairQuote() {
            return this.$page.props.data.new_repair_quote_count
        },
        newServiceBooking() {
            return this.$page.props.data.new_service_booking_count
        },
        newTestDriveSurvey() {
            return this.$page.props.data.new_test_drive_survey_count
        },
        newServiceSurvey() {
            return this.$page.props.data.new_service_survey_count
        },
        newApply() {
            return this.$page.props.data.new_apply_count
        },
        newOrder() {
            return this.$page.props.data.new_order_count
        },
    },
    methods: {
    },
}
</script>

<style scoped>
.badge {
    @apply px-2 py-1 text-xs font-medium rounded;
}
.badge-success {
    @apply text-green-700 bg-green-200;
}
.badge-danger {
    @apply text-red-600 bg-red-200;
}

</style>
