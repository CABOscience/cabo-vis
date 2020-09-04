<template>
<div class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar" v-bind:class="{ active: isActive }">

        <ul class="list-unstyled components">
            <p><strong>{{ $t('results') }}</strong></p>
            <li>
                <a href="#spectra">{{ $t('mean_spectra') }}</a>
            </li>
            <li>
                <a href="#map">{{ $t('sites') }}</a>
            </li>
            <li>
                <a href="#plants">{{ $t('plants') }}</a>
            </li>
            <li>
                <a href="#">{{ $t('leaf_analysis') }}</a>
            </li>
        </ul>

    </nav>

</div>
</template>

<script>

export default {
    name: "sidebar",
    computed: {
        isActive: {
            get () {
                return this.$store.state.sidebar
            }
        }
    },    
}
</script>

<style>

.wrapper {
    display: flex;
    width: 100%;
}

#sidebar {
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 999;
    background: #006e70;
    color: #fff;
    transition: all 0.3s;
    margin-left: -250px;
}

#sidebar a{
    color:#fff;
    text-decoration: none;
}

#sidebar.active {
    margin-left: 0px;
}

#sidebar .sidebar-header {
    padding: 20px;
    background: #006e70;
}

#sidebar ul.components {
    padding: 20px 0;
    border-bottom: 1px solid #47748b;
}

#sidebar ul p {
    color: #fff;
    padding: 10px;
}

#sidebar ul li a {
    padding: 10px;
    font-size: 1.1em;
    display: block;
}

#sidebar ul li a:hover {
    color: #006e70;
    background: #fff;
}

#sidebar ul li.active>a,
a[aria-expanded="true"] {
    color: #fff;
    background: #006e70;
}

a[data-toggle="collapse"] {
    position: relative;
}

.dropdown-toggle::after {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
}

ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #6d7fcc;
}

ul.CTAs {
    padding: 20px;
}

ul.CTAs a {
    text-align: center;
    font-size: 0.9em !important;
    display: block;
    border-radius: 5px;
    margin-bottom: 5px;
}

a.download {
    background: #fff;
    color: #008bae;
}

a.article,
a.article:hover {
    background: #008bae !important;
    color: #fff !important;
}


@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
    }
    #sidebar.active {
        margin-left: -250px;
    }
    #content, #content.active {
        width: 100% !important;
    }
/*    #content.active {
        width: calc(100% - 250px);
    }*/
    #sidebarCollapse span {
        display: none;
    }
}

</style>
