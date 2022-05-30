<?php

    // Create data
    $data = http_build_query([
        'text' => 'Yes - No - Stop?',
        'chat_id' => '804206736'
    ]);

    // Create keyboard
    $keyboard = json_encode([
        "inline_keyboard" => [
            [
                [
                    "text" => "Yes",
                    "callback_data" => "yes"
                ],
                [
                    "text" => "No",
                    "callback_data" => "no"
                ],
                [
                    "text" => "Stop",
                    "callback_data" => "stop"
                ]
            ]
        ]
    ]);

    // Send keyboard
    $url = "https://api.telegram.org/bot5104688774:AAFZr02MVqTE3shadMVbxQ9c-t9JIWOo_BE/sendMessage?{$data}&reply_markup={$keyboard}";
    $res = file_get_contents($url);
    echo $url;