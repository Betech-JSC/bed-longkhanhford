<template>
    <Form url="/users" :data="schema" v-slot="{ form }">
        <!-- <div v-for="field in schema.fields" :key="field.name">
            <label :for="field.name">{{ field.label }}</label>
            <Field :as="field.as" :id="field.name" :name="field.name" />
        </div>
        <button>Submit</button> -->
    </Form>
</template>
<script>
export default {
    props: {
        schema: {
            type: Object,
            required: true,
        },
    },
};
</script>
