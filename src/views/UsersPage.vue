<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import UsersList from '@/components/UsersPage/index.vue'
</script>

<template>
  <main-master-page>
    <section class="users section">
      <div class="users__container">
        <h1 class="users__title title">
          {{ $t('UsersPage.title') }}
        </h1>
        <RouterLink :to="{ name: 'user_editor' }">
          <v-btn class="users__add-btn">
            {{ $t('buttons.add') }}
          </v-btn>
        </RouterLink>
        <UsersList />
      </div>
    </section>
  </main-master-page>
</template>


<style lang="scss" scoped>
</style>