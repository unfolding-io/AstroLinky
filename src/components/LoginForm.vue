<template>
  <div class="login-form max-w-[22rem] grid grid-cols-1 gap-4">
    <form @submit.prevent="handleSubmit" class="grid gap-3">
      <div>
        <label for="email" class="uppercase text-sm">Username:</label>
        <Input
          id="email"
          v-model="form.email"
          required
          @focus="handleFocus"
          class="text-slate-700 p-6 text-lg"
        />
      </div>
      <div>
        <label for="password" class="uppercase text-sm">Password:</label>
        <Input
          type="password"
          id="password"
          v-model="form.password"
          required
          @focus="handleFocus"
          class="text-slate-700 p-6 text-lg"
        />
      </div>
      <Button
        type="submit"
        class="text-lg p-6 hover:bg-teal-400 hover:text-slate-700 mt-3"
        :disabled="!pass"
        >Login
      </Button>
    </form>
    <div class="py-2 text-red-600">
      {{ invalid }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { actions } from "astro:actions";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// State
const invalid = ref("");
const form = reactive({ 
  email: "", 
  password: "" 
});

// Validation rules
const rules = {
  email: {
    type: "string",
    min: 2,
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
};

const { pass } = useAsyncValidator(form, rules);

// Methods
const handleFocus = (event) => {
  event.target.select();
};

const handleSubmit = async () => {
  try {
    const { data, error } = await actions.login({
      email: form.email,
      password: form.password,
    });

    if (error) {
      throw error;
    }

    if (data?.status === "error") {
      invalid.value = data.message;
      return;
    }

    if (data?.status === "success") {
      invalid.value = "";
      window.location.href = "/admin";
    }
  } catch (error) {
    invalid.value = error.message;
    console.error("Login error:", error);
  }
};
</script>
