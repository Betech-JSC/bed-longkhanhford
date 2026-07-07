<template>
    <div class="col-span-full lg:col-span-4">
        <div class="overflow-hidden card">
            <div class="card-body !p-0">
                <Accordion
                    :activeIndex="Array.from(Array(20).keys())"
                    :multiple="true"
                >
                    <AccordionTab v-if="settingBar.info" :header="tt('models.setting.setting_general')">
                        <Link
                            v-if="settingBar.general"
                            class="item"
                            :href="
                                route('admin.settings.form', {
                                    id: 'general',
                                })
                            "
                            :class="{
                                active: isUrl('admin.settings.form', {
                                    id: 'general',
                                }),
                            }"
                        >
                            {{ tt('models.setting.general_information') }}
                        </Link>
                        <Link
                            v-if="!!route().t.routes['admin.settings.meta-pages.index']"
                            :href="route('admin.settings.meta-pages.index')"
                            class="item"
                            :class="{
                                active: isUrl('admin.settings.meta-pages.*'),
                            }"
                        >
                            Meta
                        </Link>
                        <Link
                            v-if="settingBar.robots_txt"
                            class="item"
                            :href="
                                route('admin.settings.form', {
                                    id: 'robots_txt',
                                })
                            "
                            :class="{
                                active: isUrl('admin.settings.form', {
                                    id: 'robots_txt',
                                }),
                            }"
                        >
                            Robots.txt
                        </Link>
                        <Link
                            v-if="!!route().t.routes['admin.settings.redirects.index']"
                            :href="route('admin.settings.redirects.index')"
                            class="item"
                            :class="{
                                active: isUrl('admin.settings.redirects.*'),
                            }"
                        >
                            Redirects
                        </Link>
                        <Link
                            v-if="settingBar.custom_vars"
                            class="item"
                            :href="
                                route('admin.settings.form', {
                                    id: 'custom_vars',
                                })
                            "
                            :class="{
                                active: isUrl('admin.settings.form', {
                                    id: 'custom_vars',
                                }),
                            }"
                        >
                            {{ tt('models.setting.custom_vars') }}
                        </Link>
                    </AccordionTab>
                    <AccordionTab :header="tt('Công cụ tính toán')">
                        <Link
                            class="item"
                            :href="
                                route('admin.settings.form', {
                                    id: 'installment',
                                })
                            "
                            :class="{
                                active: isUrl('admin.settings.form', {
                                    id: 'installment',
                                }),
                            }"
                        >
                            {{ tt('Lãi suất trả góp') }}
                        </Link>
                    </AccordionTab>
                    <AccordionTab v-if="settingBar.email" header="Email">
                        <Link
                            v-if="settingBar.smtp"
                            class="item"
                            :href="
                                route('admin.settings.form', {
                                    id: 'smtp',
                                })
                            "
                            :class="{
                                active: isUrl('admin.settings.form', {
                                    id: 'smtp',
                                }),
                            }"
                        >
                            {{ tt('models.setting.config_smtp') }}
                        </Link>
                        <Link
                            v-if="settingBar.notification"
                            class="item"
                            :href="
                                route('admin.settings.form', {
                                    id: 'notification',
                                })
                            "
                            :class="{
                                active: isUrl('admin.settings.form', {
                                    id: 'notification',
                                }),
                            }"
                        >
                            {{ tt('models.setting.notification') }}
                        </Link>
                    </AccordionTab>
                </Accordion>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            settingBar: this.$page.props.setting_bar
        }
    }
};
</script>
