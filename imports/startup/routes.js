import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('app_body', { main: 'home' });
  }
});

FlowRouter.route('/room/:_id', {
  name: 'show_room',
  action(params, queryParams) {
    BlazeLayout.render('app_body', { main: 'show_room' });
  }
});

FlowRouter.route('/invites', {
  name: 'my_invites',
  action(params, queryParams) {
    BlazeLayout.render('app_body', { main: 'my_invites' });
  }
});