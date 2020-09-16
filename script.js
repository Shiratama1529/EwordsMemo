'use strict';

$(function() {
    const questions = [];
    let qNumber = -1;
    let point = 0, localValue = 1;
    let flag = false;
    let word, exampleFirst, exampleLast, exampleJapanese, getArray, decodeArray;

    let j = 1;
    let StorageLength = 0;
    showAddedWords();

    $('#button-goset').click(function() {
        $('#comment-qnone').css('display','none');
        $('#select-panel').css('display','none');
        $('#setting-panel').css('display','block');
        $('#list-word').css('display','block');
        $('#button-back').css('display','block');
    });

    $('#button-execute').click(function() {
        flag = false;
        word = $('#word').val();
        exampleFirst = $('#example-first').val();
        exampleLast = $('#example-last').val();
        exampleJapanese = $('#example-japanese').val();
        while(flag === false) {
            if(localStorage.getItem(String(localValue)) !== null) {
                localValue++;
            } else {
                flag = true;
                localStorage.setItem(String(localValue),word+","+exampleFirst+","+exampleLast+","+exampleJapanese);
                $('#word').val('');
                $('#example-first').val('');
                $('#example-last').val('');
                $('#example-japanese').val('');
            }
        }
        showAddedWords();
    });

    $('#button-start').click(function() {
        if(questions.length !== 0) {
            $('#select-panel').css('display','none');
            $('#game-panel').css('display','block');
            $('#button-back').css('display','block');
            $('#result').text("");
            $('#correct-answer').text('');
            $('#answer').val("");
            qNumber = -1;
            for(var i = questions.length - 1; i > 0; i--){
                var r = Math.floor(Math.random() * (i + 1));
                var tmp = questions[i];
                questions[i] = questions[r];
                questions[r] = tmp;
            }
            setQuestion();
        } else {
            $('#comment-qnone').css('display','block');
        }
    });

    $('#button-check').click(function() {
        let $answer = $('#answer').val();
        document.getElementById('button-check').disabled = true;
        if($answer === questions[qNumber].word){
            $('#result').text('OK!');
            point++;
        } else {
            $('#result').text("Oops! Let's check the answer.");
            $('#correct-answer').text('A. ' + questions[qNumber].word);
        }
        $('#button-next').css('display','block');
        if(qNumber === questions.length - 1) {
            $('#button-next').css('display','none');
            $('#comment-end').text("That's all. Good job! (" + point + "/" + questions.length + ")");
        }
    });

    $('#button-next').click(function() {
        setQuestion();
        $('#result').text("");
        $('#correct-answer').text('');
        $('#answer').val("");
        document.getElementById('button-check').disabled = false;
        $('#button-next').css('display','none');
    });

    $('#button-back').click(function() {
        document.location.reload();
    });

    function setQuestion() {
        qNumber++;
        $('#example-sentence').html(questions[qNumber].frontExample + ' <span id="question-border"><span class="question">space</span></span> ' + questions[qNumber].backExample);
        $('#example-sentence-japanese').text(questions[qNumber].exampleJapanese);
    }

    function setQuestionString() {
        j = 1;
        while(localStorage.getItem(String(j)) !== null) {
            getArray = localStorage.getItem(String(j));
            decodeArray = getArray.split(',');
            questions.push({word: decodeArray[0], frontExample: decodeArray[1], backExample: decodeArray[2],exampleJapanese: decodeArray[3]});
            j++;
        }
    }

    function showAddedWords() {
        questions.length = 0;
        setQuestionString();
        $('#list-word').html('');
        for(let n = 0; n < questions.length; n++) {
            $('#list-word').append('<li>' + questions[n].word + ' 　<button class="button-delete" id="' + (n + 1) + '">☓</button></li><br>');
        }
    }

    $('#list-word').on('click', '.button-delete',function(){
        let wordNumber = 0;
        let value;
        wordNumber = $(this).attr('id');
        localStorage.removeItem(wordNumber);
        wordNumber++;
        while(localStorage.getItem(String(wordNumber)) !== null) {
            value = localStorage.getItem(String(wordNumber));
            localStorage.setItem(String(wordNumber - 1),value);
            localStorage.removeItem(wordNumber);
            wordNumber++;
        }
        if(localValue > 1) {
            localValue--;
        }
        $(this).parent().css('display','none');
        showAddedWords();
    });
});
