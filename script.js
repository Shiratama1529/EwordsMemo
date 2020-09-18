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
        $('#button-go-backup').css('display','block');
        $('#comment-sorry').css('display','none');
        $('#comment-list-word').css('display','block');
        $('#button-all-delete').css('display','block');
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
                localStorage.setItem(String(localValue),word+"^^^"+exampleFirst+"^^^"+exampleLast+"^^^"+exampleJapanese);
                $('#word').val('');
                $('#example-first').val('');
                $('#example-last').val('');
                $('#example-japanese').val('');
            }
        }
        showAddedWords();
    });
    
    $('input').change(function() {
        let decoded = escapeHTML($(this).val());
        $(this).val(decoded);
    });

    function escapeHTML(str) {
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#39;');
        return str;
       }

    $('#button-go-backup').click(function() {
        $('#comment-sorry').css('display','none');
        $('#select-panel').css('display','none');
        $('#backup-panel').css('display','block');
        $('#button-go-backup').css('display','none');
        $('#button-back').css('display','block');
    });

    $('#button-create-backup').click(function() {
        const BackupData = [];
        for(let a = 1; a <= questions.length; a++) {
            let getBackup = localStorage.getItem(String(a));
            BackupData.push(getBackup);
        }
        if(BackupData.length > 0) {
            let blob = new Blob([BackupData.join('|||')],{type:"text/plan"});
            let link = document.createElement('a');
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate(); 
            link.href = URL.createObjectURL(blob);
            link.download = 'EwordsMemo_' + year + '_' + month + '_' + date + '.eback';
            link.click();
            $('#comment-report').css('visibility','hidden');
        } else {
            $('#comment-report').css('visibility','visible');
        }
    });

    addEventListener('load', function() {
        const f = document.getElementById('button-load-backup');
        f.addEventListener('change', function(evt) {
            let input = evt.target;
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = function() {
                let decodeData = reader.result.split('|||');
                let o = 1;
                while(localStorage.getItem(String(o)) !== null) {
                    localStorage.removeItem(String(o));
                    o++;
                }
                for(let i = 0; i < decodeData.length; i++) {
                    localStorage.setItem(String(i + 1),escapeHTML(decodeData[i]));
                }
                $('#comment-load-completed').css('display','block');
            };
            reader.readAsText(file);
            showAddedWords();
        });
    });

    $('#button-start').click(function() {
        if(questions.length !== 0) {
            $('#comment-sorry').css('display','none');
            $('#select-panel').css('display','none');
            $('#game-panel').css('display','block');
            $('#button-back').css('display','block');
            $('#comment-list-forget-word').css('display','block');
            $('#list-forget-word').css('display','block');
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
            $('#list-forget-word').append('<li class="forget-english">' + questions[qNumber].frontExample + questions[qNumber].word + questions[qNumber].backExample + '</li><li class="forget-japanese">' + questions[qNumber].exampleJapanese + '</li>');
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
        questions.length = 0;
        j = 1;
        while(localStorage.getItem(String(j)) !== null) {
            getArray = localStorage.getItem(String(j));
            decodeArray = getArray.split('^^^');
            questions.push({word: decodeArray[0], frontExample: decodeArray[1], backExample: decodeArray[2],exampleJapanese: decodeArray[3]});
            j++;
        }
    }

    function showAddedWords() {
        setQuestionString();
        $('#list-word').html('');
        for(let n = 0; n < questions.length; n++) {
            $('#list-word').append('<li>' + questions[n].word + ' 　<button class="button-delete" id="' + (n + 1) + '">☓</button></li><br>');
        }
    }

    $('#button-all-delete').click(function() {
        let o = 1;
        while(localStorage.getItem(String(o)) !== null) {
            localStorage.removeItem(String(o));
            o++;
        }
        showAddedWords();
    });

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
