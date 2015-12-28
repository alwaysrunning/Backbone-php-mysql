$(function(){
	App.run()
})

var App = {
	run : function(){
		this.addview = new this.addView()
		this.searchview = new this.searchView()
		this.listview = new this.listView()
		this.contactcollection = new this.contactCollection()
		this.router = new this.Router()
		Backbone.history.start();
	}
}

App.Router = Backbone.Router.extend({
	routes: {
		'add' : 'renderAddNew',
		'list': 'renderList',
		'search': 'renderSearch',
		'edit/:id':'renderEdit',
		'': 'renderList'
	},
	renderAddNew: function(){
		App.addview.addPage()
	},
    renderList: function(){
    	App.listview.setElement('div.abPanel')
    	App.listview.listPage()
    },
    renderEdit: function(id){
    	App.addview.addPage(id)
    },
    renderSearch: function(){
    	App.searchview.searchPage()
    }
	
})


App.searchView = Backbone.View.extend({
	el: 'div.abPanel',
	template: _.template($('#searchContactTemplate').html()),
	events: {
		'submit form#searchForm': 'searchContacts'
	},
	initialize: function(){
		_.bindAll(this,'searchPage','searchContacts')
	},
	searchPage : function(){
		this.$el.html(this.template())
		App.listview.setElement('#gridd')
		App.listview.render({})
	},
	searchContacts: function(){
		var name = $('#inName').val();
		App.listview.listPage(name)
	}
})

App.listView = Backbone.View.extend({
		el: 'div.abPanel',
		template: _.template($('#listContactTemplate').html()),
		initialize: function(){
			_.bindAll(this,'listPage','render')
		},
		render : function(response){
			var self = this
			this.$el.html(this.template({contacts:response}));
			$('#contactTable tr[data-id]').each(function(){
				var id = $(this).attr('data-id')
				$(this).find('a.edit').click(function(){
					self.editContact(id)
				})
				$(this).find('a.delete').click(function(){
					self.deleteContact(id)
				})
			})
		},
		listPage: function(querying){
			var self = this
			App.contactcollection.fetch({
				data: {
					full_name:querying
				},
				success: function(collection,response){
					self.render(response)
				}
			})
		},
		editContact: function(id){
			App.router.navigate('edit/'+id,{trigger:true})
		},
		deleteContact: function(id){
			if(confirm('are you sure')){
				App.contactcollection.get(id).destroy()
			}
		}
})

App.addView = Backbone.View.extend({

	el: 'div.abPanel',

	template: _.template($('#addContactTemplate').html()),

	events : {
		'submit form#addContactForm' : 'addContactEvent'
	},

	initialize: function(){
		_.bindAll(this,'addPage','addContactEvent')
	},

	addPage: function(id){
		var contact = {};
		if(id){
			var model = App.contactcollection.get(id)
			contact = model.toJSON()
		}
		this.$el.html(this.template({contact:contact}))
	},

	addContactEvent : function(events){
		var full_name = $('#inputName').val(),
		    email = $('#inputEmail').val(),
		    phone = $('#inputPhone').val(),
		    address = $('#inputAddress').val(),
		    id = $('#id').val();
		if(!full_name||!email||!phone||!address){
			confirm('请将信息填写完整');
			return false
		}   
		if(id===""){
			var contactmodel = new App.ContactModel({
				    full_name: full_name|| '',
				    email: email|| '',
				    phone: phone|| '',
				    address: address|| ''
			})
		}else{
			var contactmodel = new App.ContactModel({
				    full_name: full_name|| '',
				    email: email|| '',
				    phone: phone|| '',
				    address: address|| '',
				    id: id || ''
			})
		}
		contactmodel.save();
		return false;
	}
})

App.ContactModel = Backbone.Model.extend({
	sync : function(method,model,options){
		if(method==='update' || method==='create'){
			return $.ajax({
				dataType: 'json',
				url: 'server/add.php',
				data: {
					id: (this.get('id')|| ''),
				    full_name: (this.get('full_name')|| ''),
				    email: (this.get('email')|| ''),
				    phone: (this.get('phone')|| ''),
				    address: (this.get('address')|| '')
				},
				success: function(data){
					$('span.false').html();
                    if(data.success){
                    	if(method=='update'){
                    		App.router.navigate('list',{trigger:true})
                    	}else{
                    		$('form').get(0).reset()
                    		App.router.navigate('list',{trigger:true})
                    	}
                    }else{
                    	alert('failsure')
                    }
				}

			})
		}
		else if(method==='delete'){
			var id = this.get('id');
			return $.getJSON('server/delete.php',{id:id},function(data){
				if(data.success){
                   $('#contactTable tr[data-id="'+id+'"]').hide('slow',function(){
                   	    $(this).html('')
                        $(this).remove()	
                   })	
				}
			})
		}
	}
})

App.contactCollection = Backbone.Collection.extend({
	model: App.ContactModel,
	url: 'server/list.php'
})
