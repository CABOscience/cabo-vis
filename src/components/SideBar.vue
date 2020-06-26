<template>
<div class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar" v-bind:class="{ active: isActive }">

        <ul class="list-unstyled components">
            <p>Results</p>
            <li>
                <a href="#spectra">Mean spectra</a>
            </li>
            <li>
                <a href="#map">Sites</a>
            </li>
            <li>
                <a href="#plants">Plants</a>
            </li>
            <li>
                <a href="#">Leaf analysis</a>
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
    background: #008bae;
    color: #fff;
    transition: all 0.3s;
}

#sidebar a{
    color:#fff;
    text-decoration: none;

}

#sidebar.active {
    margin-left: -250px;
}

#sidebar .sidebar-header {
    padding: 20px;
    background: #008bae;
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
    color: #008bae;
    background: #fff;
}

#sidebar ul li.active>a,
a[aria-expanded="true"] {
    color: #fff;
    background: #008bae;
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
</style>
