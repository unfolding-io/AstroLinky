<template>
  <div class="flex-col flex lg:flex-row gap-4 md:gap-20 items-center w-full">
    <div class="flex flex-col justify-center gap-6 w-full h-fit max-w-lg">
      <slot />

      <form
        @submit.prevent="handleSubmit"
        class="flex flex-col justify-center gap-10 w-full h-fit"
      >
        <div class="grid grid-cols-1 gap-1 relative flex-1 min-w-[300px]">
          <label for="href" class="uppercase text-xs text-slate-400">
            Shorten a long URL</label
          >

          <Input
            type="text"
            v-model="form.href"
            id="href"
            placeholder="https://"
            required
            class="text-slate-700 text-lg p-7"
            @focus="handleFocus"
            @blur="updateSlug"
            @mouseleave="updateSlug"
          />

          <div class="h-4 absolute -bottom-5 text-red-400">
            <span v-if="errorFields?.href && errorFields?.href[0]?.message">
              {{ errorFields.href[0].message }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-1 relative flex-1 min-w-[300px]">
          <label for="slug" class="uppercase text-xs text-slate-400"
            >Alias</label
          >

          <Input
            type="text"
            v-model="form.slug"
            id="slug"
            required
            class="text-slate-700 text-lg p-7"
            @focus="handleFocus"
            @input="handleCheck"
          />

          <div class="h-4 absolute -bottom-5 text-red-400">
            <span v-if="errorFields?.slug && errorFields?.slug[0]?.message">
              {{ errorFields.slug[0].message }}
            </span>
            <span v-if="!isUnique"> not unique </span>
            <span v-if="notAllowed"> not allowed </span>
          </div>
        </div>
        <Button
          type="submit"
          :disabled="!pass || !isUnique || notAllowed"
          class="mt-2 text-lg bg-slate-800 hover:bg-teal-400 hover:text-slate-800 p-7"
        >
          Generate Linky
        </Button>
      </form>
    </div>

    <div class="w-full max-w-3xl">
      <div
        v-if="active.status === 'success'"
        class="flex gap-6 flex-wrap justify-between py-4 truncate items-end bg-slate-800/30 p-4 sm:p-8 rounded-sm"
      >
        <div class="grid grid-cols-1 gap-2 h-fit flex-1 min-w-[260px]">
          <a
            class="truncate text-slate-400 hover:text-teal-400"
            :href="`${baseUrl}/${active.slug}`"
            target="_blank"
            >{{ active.href }}</a
          >
          <div class="grid grid-cols-1">
            <useClipboard
              v-slot="{ copy, copied }"
              :source="`${baseUrl}/${active.slug}`"
            >
              <TooltipProvider>
                <Tooltip :open="copied">
                  <TooltipTrigger asChild>
                    <button
                      @click="copy()"
                      class="lg:text-lg relative bg-slate-200 text-slate-800 rounded-sm px-2 py-1 shadow-inner truncate flex gap-2 items-center hover:bg-slate-900 hover:text-slate-200"
                    >
                      <div class="mr-4 truncate">
                        {{ baseUrl }}/{{ active.slug }}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        class="shrink-0 absolute right-2"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        >
                          <rect
                            width="14"
                            height="14"
                            x="8"
                            y="8"
                            rx="2"
                            ry="2"
                          />
                          <path
                            d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                          />
                        </g>
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    align="end"
                    class="bg-slate-800 text-slate-100 border-0"
                  >
                    <p>copied</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </useClipboard>
          </div>
        </div>

        <div
          class="rounded-sm min-w-[260px] p-5 flex-1 bg-white text-slate-500 uppercase text-[0.7rem] grid grid-cols-1 gap-1"
        >
          <img
            :src="`/qr?href=${encodeURIComponent(`${baseUrl}/${active.slug}`)}&name=${active.slug})`"
            alt="QR code"
            class="w-full h-auto"
          />
          <a
            :href="`/qr?href=${encodeURIComponent(`${baseUrl}/${active.slug}`)}&name=${active.slug}&download=1`"
            target="_blank"
            class="hover:text-teal-400 flex gap-2 items-center justify-center text-center w-full -mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              class="text-xl"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <rect width="5" height="5" x="3" y="3" rx="1" />
                <rect width="5" height="5" x="16" y="3" rx="1" />
                <rect width="5" height="5" x="3" y="16" rx="1" />
                <path
                  d="M21 16h-3a2 2 0 0 0-2 2v3m5 0v.01M12 7v3a2 2 0 0 1-2 2H7m-4 0h.01M12 3h.01M12 16v.01M16 12h1m4 0v.01M12 21v-1"
                />
              </g>
            </svg>
            Download QR
          </a>
        </div>
      </div>
      <div v-if="active.status !== 'success'">
        <slot name="illustration" />

      </div>
    </div>
  </div>

  <div
    class="grid absolute inset-0 bg-slate-700/80 text-slate-200 text-2xl"
    v-if="loading"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      class="absolute top-4 right-4"
      viewBox="0 0 24 24"
    >
      <g stroke="currentColor">
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill="none"
          stroke-linecap="round"
          stroke-width="3"
        >
          <animate
            attributeName="stroke-dasharray"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            keyTimes="0;0.475;0.95;1"
            repeatCount="indefinite"
            values="0 150;42 150;42 150;42 150"
          />
          <animate
            attributeName="stroke-dashoffset"
            calcMode="spline"
            dur="1.5s"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
            keyTimes="0;0.475;0.95;1"
            repeatCount="indefinite"
            values="0;-16;-59;-59"
          />
        </circle>
        <animateTransform
          attributeName="transform"
          dur="2s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { actions } from "astro:actions";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { useDebounceFn } from "@vueuse/core";
import slugify from "@sindresorhus/slugify";
import { v5 as uuidv5 } from "uuid";
import { UseClipboard } from "@vueuse/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Props
defineProps({
  data: Object,
  baseUrl: String,
});

// State
const form = reactive({ href: "", slug: "" });
const active = ref({ status: null });
const loading = ref(false);
const isUnique = ref(true);

// Validation rules
const rules = {
  slug: {
    type: "string",
    min: 2,
    max: 100,
    required: true,
  },
  href: {
    type: "url",
    required: true,
  },
};

const { pass, errorFields } = useAsyncValidator(form, rules);

// Computed
const notAllowed = computed(() => {
  const excludes = ["admin", "login", "logout", "index", "qr"];
  return excludes.includes(slugify(form.slug));
});

// Methods
function getUUIDv5(url) {
  return uuidv5(url, uuidv5.URL).substring(0, 8);
}

const handleCheck = useDebounceFn(async () => {
  try {
    const { data, error } = await actions.getLink({ slug: form.slug });
    if (error) throw error;
    isUnique.value = !data;
  } catch (error) {
    console.error(error);
    isUnique.value = false;
  }
}, 300);

const handleSubmit = async () => {
  try {
    loading.value = true;
    const { data, error } = await actions.addLinkPublic({
      href: form.href,
      slug: slugify(form.slug),
    });

    if (error) throw error;

    if (data.status === "error") {
      isUnique.value = false;
      return;
    }

    // Reset form and update active link
    form.href = "";
    form.slug = "";
    active.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const updateSlug = () => {
  if (!form.slug && form.href) {
    form.slug = getUUIDv5(form.href);
  }
};

const handleFocus = (event) => {
  event.target.select();
};
</script>
