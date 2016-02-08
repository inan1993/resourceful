var resourceHooks = {
    after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    insert: function(error, result) {
        if(error){
            toastr.error(error);
            console.log(error);
        }
        else{
            console.log(result);
            toastr.success('added resource '+ Resources.findOne(result).name);
        }
    }
  }
}

AutoForm.addHooks('insertResourceForm', resourceHooks);