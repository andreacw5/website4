<script setup lang="ts">
import { useItemStore } from '~/stores';
import type { Item } from '~/stores';

const { t } = useI18n();
const itemStore = useItemStore();

// ── Dialog state ───────────────────────────────────────────────────────
const dialog      = ref(false);
const editDialog  = ref(false);
const deleteDialog = ref(false);
const snackbar    = ref(false);
const snackbarText  = ref('');
const snackbarColor = ref<'success' | 'error' | 'info'>('success');

// ── Form refs ──────────────────────────────────────────────────────────
const formRef     = ref();
const editFormRef = ref();

// ── Add form ───────────────────────────────────────────────────────────
const itemName        = ref('');
const itemDescription = ref('');
const itemEnabled     = ref(true);
const itemType        = ref('');
const itemPriority    = ref(1);

// ── Edit form ──────────────────────────────────────────────────────────
const editingItem    = ref<Item | null>(null);
const editName        = ref('');
const editDescription = ref('');
const editEnabled     = ref(true);
const editType        = ref('');
const editPriority    = ref(1);

// ── Delete ─────────────────────────────────────────────────────────────
const itemToDelete = ref<number | null>(null);

// ── Filters ────────────────────────────────────────────────────────────
const search     = ref('');
const filterType = ref<string | null>(null);

const typeOptions = ['Type A', 'Type B', 'Type C', 'Type D'];

// ── Validation rules ───────────────────────────────────────────────────
const required  = (v: string) => !!v || t('validation.required');
const minLen2   = (v: string) => v?.length >= 2 || t('validation.minLength');
const nameRules = [required, minLen2];
const reqRules  = [required];

// ── SEO ───────────────────────────────────────────────────────────────
useHead(() => ({ title: t('configuration.title') }));
useSeoMeta({
  title: t('seo.title'),
  description: t('seo.description'),
  ogTitle: t('seo.ogTitle'),
  ogDescription: t('seo.ogDescription'),
  ogType: 'website',
  ogImage: t('seo.ogImage'),
  twitterCard: 'summary_large_image',
});

// ── Stats ──────────────────────────────────────────────────────────────
const totalItems    = computed(() => itemStore.items.length);
const enabledItems  = computed(() => itemStore.items.filter(i => i.enabled).length);
const disabledItems = computed(() => itemStore.items.filter(i => !i.enabled).length);

// ── Filtered items ─────────────────────────────────────────────────────
const filteredItems = computed(() =>
  itemStore.items.filter(item => {
    const q = search.value.toLowerCase();
    const matchesSearch = !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    const matchesType = !filterType.value || item.type === filterType.value;
    return matchesSearch && matchesType;
  })
);

// ── Helpers ────────────────────────────────────────────────────────────
const showSnackbar = (text: string, color: 'success' | 'error' | 'info' = 'success') => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

const typeColor = (type: string): string => ({
  'Type A': 'primary',
  'Type B': 'secondary',
  'Type C': 'info',
  'Type D': 'warning',
} as Record<string, string>)[type] ?? 'default';

const priorityColor = (p: number) =>
  p <= 1 ? 'success' : p <= 2 ? 'info' : p <= 3 ? 'warning' : 'error';

// ── Add ────────────────────────────────────────────────────────────────
const addItem = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  itemStore.addItem(itemName.value, itemDescription.value, itemEnabled.value, itemType.value, itemPriority.value);
  dialog.value = false;
  resetAddForm();
  showSnackbar(t('configuration.itemAdded'));
};

const resetAddForm = () => {
  itemName.value = '';
  itemDescription.value = '';
  itemEnabled.value = true;
  itemType.value = '';
  itemPriority.value = 1;
  formRef.value?.reset();
};

// ── Edit ───────────────────────────────────────────────────────────────
const openEdit = (item: Item) => {
  editingItem.value    = item;
  editName.value        = item.name;
  editDescription.value = item.description;
  editEnabled.value     = item.enabled;
  editType.value        = item.type;
  editPriority.value    = item.priority ?? 1;
  editDialog.value = true;
};

const saveEdit = async () => {
  const { valid } = await editFormRef.value.validate();
  if (!valid || !editingItem.value) return;
  itemStore.updateItem(editingItem.value.id, editName.value, editDescription.value, editEnabled.value, editType.value, editPriority.value);
  editDialog.value = false;
  showSnackbar(t('configuration.itemUpdated'));
};

// ── Toggle enabled inline ──────────────────────────────────────────────
const toggleEnabled = (item: Item) => {
  itemStore.updateItem(item.id, item.name, item.description, !item.enabled, item.type, item.priority);
};

// ── Delete ─────────────────────────────────────────────────────────────
const deleteItem = (id: number) => {
  itemToDelete.value = id;
  deleteDialog.value = true;
};

const confirmDelete = () => {
  if (itemToDelete.value !== null) {
    itemStore.removeItem(itemToDelete.value);
    deleteDialog.value = false;
    itemToDelete.value = null;
    showSnackbar(t('configuration.itemDeleted'), 'error');
  }
};

const cancelDelete = () => {
  deleteDialog.value = false;
  itemToDelete.value = null;
};

// ── Table headers ──────────────────────────────────────────────────────
const headers = computed(() => [
  { title: t('configuration.table.id'),          key: 'id',          align: 'start'  as const, width: '72px'  },
  { title: t('configuration.table.name'),        key: 'name',        align: 'start'  as const },
  { title: t('configuration.table.description'), key: 'description', align: 'start'  as const },
  { title: t('configuration.table.type'),        key: 'type',        align: 'start'  as const, width: '130px' },
  { title: t('configuration.table.priority'),    key: 'priority',    align: 'center' as const, width: '110px' },
  { title: t('configuration.table.enabled'),     key: 'enabled',     align: 'center' as const, width: '110px' },
  { title: '',                                   key: 'actions',     align: 'center' as const, width: '100px', sortable: false },
]);
</script>

<template>
  <v-container class="py-8" max-width="1400">

    <!-- ── Page Header ──────────────────────────────────────────── -->
    <div class="d-flex align-start justify-space-between mb-6 flex-wrap ga-3">
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-icon color="primary" size="26">mdi-tune-variant</v-icon>
          <h1 class="text-h5 font-weight-bold">{{ t('configuration.title') }}</h1>
        </div>
        <p class="text-body-2 text-medium-emphasis">{{ t('configuration.subtitle') }}</p>
      </div>

      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="dialog = true">
        {{ t('configuration.add') }}
      </v-btn>
    </div>

    <!-- ── Stats Row ─────────────────────────────────────────────── -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" variant="tonal" color="primary" class="stat-card">
          <v-card-text class="d-flex align-center justify-space-between pa-5">
            <div>
              <div class="text-h4 font-weight-bold text-primary">{{ totalItems }}</div>
              <div class="text-body-2 text-medium-emphasis mt-1">{{ t('configuration.stats.total') }}</div>
            </div>
            <v-avatar color="primary" variant="tonal" size="52" rounded="xl">
              <v-icon size="26">mdi-format-list-bulleted</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card rounded="xl" variant="tonal" color="success" class="stat-card">
          <v-card-text class="d-flex align-center justify-space-between pa-5">
            <div>
              <div class="text-h4 font-weight-bold text-success">{{ enabledItems }}</div>
              <div class="text-body-2 text-medium-emphasis mt-1">{{ t('configuration.stats.enabled') }}</div>
            </div>
            <v-avatar color="success" variant="tonal" size="52" rounded="xl">
              <v-icon size="26">mdi-check-circle-outline</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card rounded="xl" variant="tonal" color="error" class="stat-card">
          <v-card-text class="d-flex align-center justify-space-between pa-5">
            <div>
              <div class="text-h4 font-weight-bold text-error">{{ disabledItems }}</div>
              <div class="text-body-2 text-medium-emphasis mt-1">{{ t('configuration.stats.disabled') }}</div>
            </div>
            <v-avatar color="error" variant="tonal" size="52" rounded="xl">
              <v-icon size="26">mdi-close-circle-outline</v-icon>
            </v-avatar>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ── Table Card ─────────────────────────────────────────────── -->
    <v-card rounded="xl" elevation="1">
      <!-- Search & Filter toolbar -->
      <v-card-text class="pb-2 pt-4">
        <v-row align="center" dense class="ga-2">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              :placeholder="t('configuration.search')"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              rounded="lg"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="filterType"
              :items="typeOptions"
              :placeholder="t('configuration.filterType')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              rounded="lg"
            />
          </v-col>

          <v-col cols="12" md="2" class="d-flex justify-md-end">
            <v-chip color="primary" variant="tonal" size="small" label>
              {{ filteredItems.length }} {{ t('configuration.items') }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        hover
      >
        <!-- Type -->
        <template #item.type="{ item }">
          <v-chip :color="typeColor(item.type)" size="small" variant="tonal" rounded="lg">
            {{ item.type }}
          </v-chip>
        </template>

        <!-- Priority -->
        <template #item.priority="{ item }">
          <v-chip :color="priorityColor(item.priority ?? 1)" size="small" variant="outlined" rounded="lg">
            <v-icon start size="12">mdi-flag-outline</v-icon>
            {{ item.priority ?? 1 }}
          </v-chip>
        </template>

        <!-- Enabled switch -->
        <template #item.enabled="{ item }">
          <v-switch
            :model-value="item.enabled"
            color="success"
            density="compact"
            hide-details
            inset
            @change="toggleEnabled(item)"
          />
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-center">
            <v-btn
              icon="mdi-pencil-outline"
              size="small"
              color="primary"
              variant="text"
              @click="openEdit(item)"
            >
              <v-tooltip activator="parent" location="top">{{ t('configuration.edit') }}</v-tooltip>
            </v-btn>
            <v-btn
              icon="mdi-delete-outline"
              size="small"
              color="error"
              variant="text"
              @click="deleteItem(item.id)"
            >
              <v-tooltip activator="parent" location="top">{{ t('configuration.delete') }}</v-tooltip>
            </v-btn>
          </div>
        </template>

        <!-- Empty state -->
        <template #no-data>
          <div class="d-flex flex-column align-center py-14">
            <v-icon size="72" color="grey-lighten-1" class="mb-4">mdi-text-search</v-icon>
            <h3 class="text-h6 font-weight-medium text-medium-emphasis mb-1">
              {{ t('configuration.noItems') }}
            </h3>
            <p class="text-body-2 text-disabled">{{ t('configuration.noItemsHint') }}</p>
            <v-btn class="mt-5" color="primary" variant="tonal" prepend-icon="mdi-plus" rounded="lg" @click="dialog = true">
              {{ t('configuration.add') }}
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Add Dialog ─────────────────────────────────────────────── -->
    <v-dialog v-model="dialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-item class="pt-5 px-5 pb-0">
          <template #prepend>
            <v-avatar color="primary" variant="tonal" rounded="lg" size="44">
              <v-icon>mdi-plus</v-icon>
            </v-avatar>
          </template>
          <v-card-title class="text-h6">{{ t('configuration.addNewItem') }}</v-card-title>
          <template #append>
            <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false; resetAddForm()" />
          </template>
        </v-card-item>

        <v-card-text class="pt-5 px-5">
          <v-form ref="formRef" @submit.prevent="addItem">
            <v-row dense>
              <v-col cols="12" sm="7">
                <v-text-field
                  v-model="itemName"
                  :label="t('configuration.form.itemName')"
                  :rules="nameRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-select
                  v-model="itemType"
                  :items="typeOptions"
                  :label="t('configuration.form.type')"
                  :rules="reqRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="itemDescription"
                  :label="t('configuration.form.description')"
                  :rules="reqRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model.number="itemPriority"
                  :label="t('configuration.form.priority')"
                  type="number"
                  min="1"
                  max="10"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="7" class="d-flex align-center">
                <v-switch
                  v-model="itemEnabled"
                  :label="t('configuration.form.enabled')"
                  color="success"
                  hide-details
                  inset
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false; resetAddForm()">{{ t('dialog.cancel') }}</v-btn>
          <v-btn color="primary" variant="elevated" rounded="lg" @click="addItem">
            <v-icon start>mdi-plus</v-icon>
            {{ t('configuration.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Edit Dialog ────────────────────────────────────────────── -->
    <v-dialog v-model="editDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-item class="pt-5 px-5 pb-0">
          <template #prepend>
            <v-avatar color="secondary" variant="tonal" rounded="lg" size="44">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-avatar>
          </template>
          <v-card-title class="text-h6">{{ t('configuration.editItem') }}</v-card-title>
          <template #append>
            <v-btn icon="mdi-close" variant="text" size="small" @click="editDialog = false" />
          </template>
        </v-card-item>

        <v-card-text class="pt-5 px-5">
          <v-form ref="editFormRef" @submit.prevent="saveEdit">
            <v-row dense>
              <v-col cols="12" sm="7">
                <v-text-field
                  v-model="editName"
                  :label="t('configuration.form.itemName')"
                  :rules="nameRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-select
                  v-model="editType"
                  :items="typeOptions"
                  :label="t('configuration.form.type')"
                  :rules="reqRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editDescription"
                  :label="t('configuration.form.description')"
                  :rules="reqRules"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model.number="editPriority"
                  :label="t('configuration.form.priority')"
                  type="number"
                  min="1"
                  max="10"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" sm="7" class="d-flex align-center">
                <v-switch
                  v-model="editEnabled"
                  :label="t('configuration.form.enabled')"
                  color="success"
                  hide-details
                  inset
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">{{ t('dialog.cancel') }}</v-btn>
          <v-btn color="secondary" variant="elevated" rounded="lg" @click="saveEdit">
            <v-icon start>mdi-check</v-icon>
            {{ t('configuration.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Delete Dialog ──────────────────────────────────────────── -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-item class="pt-5 px-5">
          <template #prepend>
            <v-avatar color="error" variant="tonal" size="48" rounded="lg">
              <v-icon>mdi-alert-circle-outline</v-icon>
            </v-avatar>
          </template>
          <v-card-title>{{ t('configuration.confirmDelete') }}</v-card-title>
        </v-card-item>

        <v-card-text class="text-body-2 text-medium-emphasis pb-2 px-5">
          {{ t('configuration.deleteMessage') }}
          <p class="text-caption text-error mt-2">{{ t('configuration.deleteNote') }}</p>
        </v-card-text>

        <v-card-actions class="pa-4 pt-2">
          <v-spacer />
          <v-btn variant="text" @click="cancelDelete">{{ t('dialog.cancel') }}</v-btn>
          <v-btn color="error" variant="elevated" rounded="lg" @click="confirmDelete">
            <v-icon start>mdi-delete</v-icon>
            {{ t('configuration.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Snackbar ───────────────────────────────────────────────── -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      location="bottom end"
      rounded="lg"
      :timeout="3000"
    >
      <v-icon start size="18">
        {{ snackbarColor === 'error' ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline' }}
      </v-icon>
      {{ snackbarText }}
      <template #actions>
        <v-btn icon="mdi-close" variant="text" size="small" @click="snackbar = false" />
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-3px);
}
</style>
