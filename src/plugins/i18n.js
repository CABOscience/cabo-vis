import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const messages = {'en': {
	results : 'Results',
	mean_spectra: 'Mean spectra',
	sites: 'Sites',
	plants: 'Plants',
	leaf_analysis: 'Leaf analysis',
	reflectance: 'Reflectance',
	transmittance: 'Transmittance',
	ranges: 'Ranges',
	search: 'Search',
	enter_species_name: 'Enter species name',
	_plants_found: ' plants found',
	site_id: 'Site ID',
	plant_photos: 'Plant photos',
	photo: 'Photo',
	show: 'Show',
	hide: 'Hide',
	details: 'details',
	current_page: 'Current page',
	reset_zoom: 'Reset Zoom',
	download_csv: 'Download as CSV',
	download_spectra_data: 'Download plant spectra'
},'fr': {
	results : 'Résultats',
	mean_spectra: 'Spectres moyens',
	sites: 'Sites',
	plants: 'Plantes',
	leaf_analysis: 'Analyse des feuilles',
	reflectance: 'Réflectance',
	transmittance: 'Transmittance',
	ranges: 'Écarts',
	search: 'Recherche',
	enter_species_name: 'Entrer un nom d\'espèce',
	_plants_found: ' plantes trouvées',
	site_id: 'ID du site',
	plant_photos: 'Photos des plantes',
	photo: 'Photo',
	show: 'Voir',
	hide: 'Fermer',
	details: 'détails',
	current_page: 'Page actuelle',
	reset_zoom: 'Réinitialiser le spectre',
	download_csv: 'Télécharger CSV',
	download_spectra_data :'Télécharger données spectrales'
}};
export const i18n = new VueI18n({
	locale: 'en', 
	fallbackLocale: 'fr',
	messages:messages
});
