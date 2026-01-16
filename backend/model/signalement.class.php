<?php

class Signalement
{
    public readonly string $id_signalement;
    public string $sujet;
    public string $message;
    public readonly string $mail;
    public readonly string $id_pers_signal;
    public string $date;
    public string $status; 

    public function __construct(array $data = array())
    {
        $this->id_signalement = $data['id_signalement'] ?? -1;
        $this->sujet = $data['sujet'] ?? '';
        $this->message = $data['message'] ?? '';
        $this->mail = $data['mail'] ?? '';
        $this->date = $data['date'] ?? '';
        $this->id_pers_signal = $data['id_pers_signal'] ?? '';
        $this->status = $data['status'] ?? 'ouvert'; 
    }
}
?>