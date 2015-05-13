var VG = (function(vg) {
  vg.bleu_score = function(sentence, reference, N) {
    var matched = 0;
    var total = 0;
    for (var n = 1; n <= N; n++) {
      for (var s_index = 0; s_index + n <= sentence.length; s_index = s_index + n) {
        for (var r_index = 0; r_index + n <= reference.length; r_index = r_index + n) {
          all_matched = true;
          for (var offset = 0; offset < n; offset++) {
            //console.log(s_index+"::"+r_index+"::"+s_elem +"::"+r_elem+"::"+sentence[s_elem] + "::" + reference[r_elem])
            if (sentence[s_index + offset] != reference[r_index + offset]) {
              all_matched = false;
              break;
            }
          }
          if (all_matched) {
            matched += 1;
            break;
          }
        }
        total += 1
      }
    }
    return (matched)/total;
  }

  vg.max_bleu_score = function(sentence, references, N) {
    if (sentence == undefined || sentence.length == 0) {
      return 0;
    }
    var score = 0;
    var s = sentence.toLowerCase().split(" ");
    for (var index in references) {
      var ref = references[index];
      if (ref == undefined || ref.length == 0) {
        continue;
      }
      ref = ref.toLowerCase().split(" ");
      score = Math.max(score, vg.bleu_score(s, ref, N));
    }
    return score
  };

  vg.is_unique_sentence = function(sentence, references, threshold, N) {
    var score = vg.max_bleu_score(sentence, references, N);
    return score < threshold;
  };

  return vg;
}(VG || {}));

//console.log(VG.max_bleu_score("One horse presses its nose to another horse in a field", ["The horse on the left is brown.", "horse in a field presses its node on one horse"], 3))
//console.log(VG.max_bleu_score("One horse presses its nose to another horse in a field", ["The horse on the left is brown."], 3))
//console.log(VG.max_bleu_score("One horse presses its nose to another horse in a field", ["The horse on the left is brown.", "horse in a field presses its node on one horse", "One horse presses its nose to another horse in a field"], 3))
//console.log(VG.is_unique_sentence("One horse presses its nose to another horse in a field", ["The horse on the left is brown.", "horse in a field presses its node on one horse", "One horse presses its nose to another horse in a field"], 0.5, 3))
//console.log(VG.is_unique_sentence("One horse presses its nose to another horse in a field", ["One horse presses its nose to another horse in a field"], 0.5, 3))
//console.log(VG.bleu_score("A group of giraffe standing next to each other by tall trees.", "Three giraffes stand close together in their habitat.", 1));
VG.bleu_score = function(sentence, reference, N) {
  var matched = 0;
  var total = 0;
  for (var n = 1; n <= N; n++) {
    for (var s_index = 0; s_index + n <= sentence.length; s_index = s_index + n) {
      for (var r_index = 0; r_index + n <= reference.length; r_index = r_index + n) {
        all_matched = true;
        for (var offset = 0; offset < n; offset++) {
          //console.log(s_index+"::"+r_index+"::"+s_elem +"::"+r_elem+"::"+sentence[s_elem] + "::" + reference[r_elem])
          if (sentence[s_index + offset] != reference[r_index + offset]) {
            all_matched = false;
            break;
          }
        }
        if (all_matched) {
          matched += 1;
          break;
        }
      }
      total += 1
    }
  }
  return (matched)/total;
}