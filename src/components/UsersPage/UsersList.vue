<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()

const usersList = computed(() => usersStore.getItemsList ?? [])
</script>

<template>
  <ul class="users__list">
    <li v-for="user in usersList" :key="user.id" class="users__item item-user">
      <div class="item-user__main">
        <div class="item-user__info">
          <h4 class="item-user__email">
            {{ $t('EditorPage.email') }} -
            <a :href="'mailto:' + user.email">{{ user.email }}</a>
          </h4>
          <h6 v-if="user.password" class="item-user__password">
            {{ $t('EditorPage.password') }} - {{ user.password }}
          </h6>
        </div>
        <div class="item-user__balance">
          {{ $t('EditorPage.balance') }} -
          <span><span class="dollar">$</span>{{ user.balance }}</span>
        </div>
      </div>
      <div class="item-user__actions">
        <RouterLink :to="{ name: 'user_editor', params: { userId: user.id } }">
          <v-btn class="item-user__action">
            {{ $t('buttons.edit') }}
          </v-btn>
        </RouterLink>
        <v-btn class="item-user__action" @click="usersStore.deleteItem(user.id)">
          {{ $t('buttons.delete') }}
        </v-btn>
      </div>
    </li>
  </ul>
</template>


<style lang="scss" scoped>
</style>