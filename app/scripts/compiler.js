/**
 * Compiler Interface
 * 
 * 
 * @author: jldupont
 */
 
 
/* global mbus, Prolog 
          ,wpr
*/

(function(document) {

  mbus.sub({
     type: 'file-text'
    ,subscriber: "compiler"
    ,cb: function(msg) {
      
      var text = msg.text;
      var file = msg.file;
      
      var parsed_sentences = Prolog.parse_per_sentence(text);
      
      mbus.post('parsed',{
        sentences:  parsed_sentences
        ,file: file
      });
      
    }
  });

  function compute_error_locations(parserSummaryList) {
    var locs = [];
    
    for (var index=0; index < parserSummaryList.length; index++) {
      var entry = parserSummaryList[index];
      if (entry && (entry.maybe_error !== null))
        locs.push( entry.maybe_error.token.offset);
    }
    
    return locs;
  }


  function extract_parsed_sentences(entries) {
    
    var result = [];
    for (var index=0; index<entries.length;index++) {
      result.push( entries[index].maybe_token_list );
    }
    
    return result;
  }

  function extract_compilation_errors(entries) {
    
    var result = [];
    for (var index=0; index<entries.length;index++) {
      var maybe_error = entries[index].maybe_error;
      
      if (maybe_error)
        result.push( maybe_error );
    }
    
    return result;
  }
  

  mbus.sub({
    type: 'parsed'
    ,subscriber: 'compiler'
    ,cb: function(msg) {
        var locs = compute_error_locations(msg.sentences);
        mbus.post('error-locations', locs);
        
        if (locs.length === 0)
          mbus.post('parsed-ok', {
             file: msg.file
            ,sentences: extract_parsed_sentences( msg.sentences.sentences )
          });
    }
  });

  
  mbus.sub({
    type: 'parsed-ok'
    ,subscriber: 'compiler'
    ,cb: function(msg) {
      
      var result = Prolog.compile_per_sentence(msg.sentences);
      
      console.log(result);
      
      
      var maybe_errors = extract_compilation_errors( result );
      
      if (maybe_errors.length === 0) {
        
        send_code_to_worker("user", result);
        
        /*
        mbus.post('code', {
           file: msg.file
          ,sentences: msg.sentences
          ,code: result
        });
        */
      } else {
        mbus.post('compilation-errors', {
          file: msg.file
          ,errors: maybe_errors
        });
      }
        
    }
  });
  

  function send_code_to_worker(type, code) {
    wpr.postMessage({
      type: 'code'
      ,codes: code
      ,code_type: type
    });    
  };

})(document);
