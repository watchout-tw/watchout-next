var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event', {
	autokey: {path: 'slug', from: 'title', unique: true},
  map: {name: 'title'},
	track: true,
  defaultSort: '-time'
});

Event.add({
	title: 				{type: String, required: true},
	state: 				{type: Types.Select, options: 'draft, published, archived', default: 'draft'},
	publishedAt: 	{type: Date, dependsOn: {state: 'published'}},
	author: 			{type: Types.Relationship, ref: 'User'},
	time: 				{type: Types.Date, label: '發生時間'},
	categories: 	{type: Types.Relationship, ref: 'EventCategory', many: true, label: '分類'},
	description: 	{type: Types.Textarea, label: '簡述'},
	tags: 				{type: Types.TextArray, label: '敘事標籤'},
	link: 				{type: Types.Url},
	thumbnail: 		{type: Types.Url},
});

Event.schema.methods.isPublished = function() {
    return this.state == 'published';
}

Event.schema.pre('save', function(next) {
    if(this.isModified('state') && this.isPublished() && !this.publishedAt) {
      this.publishedAt = new Date();
    }
		if(this.isModified('tags') && this.isPublished()) {
			// add/modify/destroy? tags
		}
    next();
});

Event.defaultColumns = 'title, time|20%, description, state|10%';
Event.register();

/* event category */

var EventCategory = new keystone.List('EventCategory', {
	autokey: {from: 'name', path: 'key', unique: true}
});

EventCategory.add({
	name: {type: String, required: true},
});

EventCategory.relationship({ref: 'Event', path: 'categories'});
EventCategory.register();

/* milestone */

var Milestone = new keystone.List('Milestone', {inherits: Event});
Milestone.add({
	script: {type: Types.Url},
});

Milestone.register();

/* topic */

var Topic = new keystone.List('Topic', {
	autokey: {path: 'slug', from: 'title', unique: true},
  map: {name: 'title'},
	track: true,
  defaultSort: 'title'
});

Topic.add({
  title: 		{type: String, required: true},
  weight:   {type: Types.Number, label: '指定權重'},
  parent:   {type: Types.Relationship, ref: 'Topic', many: false, label: '上層主題'}
});

Topic.defaultColumns = 'title, weight|10%, parent|10%';
Topic.register();

/* person */

var Person = new keystone.List('Person', {
	autokey: {path: 'slug', from: 'title', unique: true},
  map: {name: 'title'},
	track: true,
  defaultSort: 'title'
});

Person.add({
	title:		{type: String, required: true},
});

Person.register();
