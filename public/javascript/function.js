//Add Listener on input file
function selectFile()
{
  let inputs = document.getElementsByClassName("inputfile");
  for(let i=0; i<inputs.length; i++)
  {
    let input = inputs[i];
    // console.log([input]);
    var label	 = input.labels[0],
    labelVal = label.innerHTML;
    input.addEventListener( 'change', function( e )
    {
      var fileName = '';
      if( this.files && this.files.length > 1 )
      fileName = this.files.length + " files selected";
      else
      fileName = "1 file selected";
      if( fileName )
      label.innerHTML = fileName;
      else
      label.innerHTML = labelVal;
    });
  }
}

//Load
setTimeout('selectFile();',1);
