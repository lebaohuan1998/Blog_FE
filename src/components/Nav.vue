<script setup>
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
    <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <div class="navbar-nav" style="width: 100%;display: block;">
            <div class="div-nav-left">
                <router-link to="/" class="nav-item nav-link">Home</router-link>
                <router-link to="/users" class="nav-item nav-link">Users</router-link>
                <router-link to="/products" class="nav-item nav-link">Products</router-link>
            </div>
            <div class="div-nav-right">
                <button @click="authStore.logout()" class="btn btn-link nav-item nav-link">Logout</button>
            </div>
        </div>
    </nav>
</template>