<template>
  <form @submit.prevent="handleSubmit"
    class="flex flex-wrap gap-10 items-end mb-4 w-full border-b-slate-500 border-b pb-10 sm:pb-14">
    <div class="grid grid-cols-1 gap-1 relative flex-1 min-w-[300px]">
      <label for="slug" class="uppercase text-xs text-slate-400">Slug</label>
      <Input type="text" v-model="form.slug" id="slug" required class="text-slate-700 text-lg" @focus="handleFocus" />
      <div class="h-4 absolute -bottom-5 text-red-400">
        <span v-if="errorFields?.slug && errorFields?.slug[0]?.message">
          {{ errorFields.slug[0].message }}
        </span>
        <span v-if="!isUnique"> Slug is not unique </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-1 relative flex-1 min-w-[300px]">
      <label for="href" class="uppercase text-xs text-slate-400">Href</label>
      <div class="flex items-stretch h-fit">
        <Input type="text" v-model="form.href" id="href" required class="text-slate-700 text-lg rounded-r-none" @focus="handleFocus" @blur="updateSlug" @mouseleave="updateSlug" />
       
        <Button type="submit" :disabled="!pass || !isUnique"
          class="rounded-l-none text-lg bg-slate-800 hover:bg-teal-400 hover:text-slate-800 py-5">
          Add
        </Button>
      </div>

      <div class="h-4 absolute -bottom-5 text-red-400">
        <span v-if="errorFields?.href && errorFields?.href[0]?.message">
          {{ errorFields.href[0].message }}
        </span>
      </div>
    </div>
  </form>

  <div class="grid absolute inset-0 bg-slate-700/80 text-slate-200 text-2xl" v-if="loading">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="absolute top-4 right-4" viewBox="0 0 24 24">
      <g stroke="currentColor">
        <circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="3">
          <animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite"
            values="0 150;42 150;42 150;42 150" />
          <animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s"
            keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite"
            values="0;-16;-59;-59" />
        </circle>
        <animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate"
          values="0 12 12;360 12 12" />
      </g>
    </svg>
  </div>
  <div class="max-w-md mb-4">
    <Input type="text" placeholder="Search" v-model="search" class="text-slate-700 text-lg" @focus="handleFocus" />
  </div>

  <div v-bind="containerProps" class="list-container overflow-y-scroll hide-scrollbar overflow-x-hidden grid grid-cols-1">
    <div v-bind="wrapperProps">
      <div v-for="{ index, data } in list" :key="index" class="" :style="{
        height: `61px`,
      }">
        <div class="flex gap-2 justify-between border-b-gray-400 border-b py-4 truncate w-full max-w-full">
          <useClipboard v-slot="{ copy, copied }" :source="`${baseUrl}/${data.slug}`">
            <TooltipProvider>
              <Tooltip :open="copied">
                <TooltipTrigger>
                  <button @click="copy()"
                    class="text-sm bg-slate-200 text-slate-800 rounded-sm px-2 py-1 shadow-inner truncate flex gap-2 items-center hover:bg-slate-900 hover:text-slate-200">
                    /{{ data.slug }}
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </g>
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent align="end" class="bg-slate-800 text-slate-100 border-0">
                  <p>copied</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </useClipboard>

          <div class="flex gap-2 items-center min-w-0">
            <a class="truncate hover:text-teal-400" :href="`${baseUrl}/${data.slug}`" target="_blank">{{ data.href
              }}</a>
            <div class="text-[0.6rem] py-0.5 px-1 rounded-sm bg-slate-500 mr-1">
              {{ data.hits }}
            </div>

            <a :href="`/qr?href=${encodeURIComponent(`${baseUrl}/${data.slug}`)}&name=${data.slug}&download=1`" target="_blank"
              class="hover:text-teal-400 text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <rect width="5" height="5" x="3" y="3" rx="1" />
                  <rect width="5" height="5" x="16" y="3" rx="1" />
                  <rect width="5" height="5" x="3" y="16" rx="1" />
                  <path
                    d="M21 16h-3a2 2 0 0 0-2 2v3m5 0v.01M12 7v3a2 2 0 0 1-2 2H7m-4 0h.01M12 3h.01M12 16v.01M16 12h1m4 0v.01M12 21v-1" />
                </g>
              </svg>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger class="hover:text-teal-400 text-xl"><svg xmlns="http://www.w3.org/2000/svg"
                  width="1em" height="1em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </g>
                </svg></DropdownMenuTrigger>
              <DropdownMenuContent class="mr-4 mt-2.5">
                <DropdownMenuItem>
                  <Button @click="() => handleRemove(data.slug)" class="bg-red-800 py-1 aspect-square pl-1 pr-2"
                    aria-label="remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
                    </svg>
                    remove
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { actions } from "astro:actions";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { useVirtualList } from "@vueuse/core";
import slugify from "@sindresorhus/slugify";
import { v5 as uuidv5 } from 'uuid';

import { UseClipboard } from "@vueuse/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const props = defineProps({
  data: Object,
  baseUrl: String,
});

const form = reactive({ href: "", slug: "" });
const allLinks = ref([]);
const loading = ref(false);

const search = ref("");

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

const filteredItems = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return allLinks.value.filter(
    (item) =>
      item.slug.toLowerCase().includes(searchTerm) ||
      item.href.toLowerCase().includes(searchTerm)
  );
});

const isUnique = computed(() => {
  const excludes = ["admin", "login", "logout", "index", "qr"];
  if (excludes.includes(slugify(form.slug))) return false;
  return !allLinks.value?.some((link) => link.slug === slugify(form.slug));
});

const { list, containerProps, wrapperProps } = useVirtualList(
  filteredItems,
  {
    itemHeight: 61,
    overscan: 20,
  }
);

function getUUIDv5(url) {
  return uuidv5(url, uuidv5.URL).substring(0, 8);
}

const handleRemove = async (slug) => {
  try {
    loading.value = true;
    const { data, error } = await actions.removeLink({ slug });
    if (error) throw error;
    allLinks.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const slugified = slugify(form.slug);

    if (allLinks.value.some((link) => link.slug === slugified)) {
      return;
    }

    const { data, error } = await actions.addLink({
      href: form.href,
      slug: slugified,
    });

    if (error) throw error;

    // Reset form and update links
    form.href = "";
    form.slug = "";
    allLinks.value = data;
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

onMounted(() => {
  allLinks.value = props.data.reverse();
});
</script>
