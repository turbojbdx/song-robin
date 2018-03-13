import { Template } from 'meteor/templating';
import './home.html';

Template.home.onCreated(() => {
	$(document).ready(() => {
		setTimeout(() => { $("#main").fadeIn(100); }, 500);
	});
});
