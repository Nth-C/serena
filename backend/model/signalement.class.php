<?php

class Signalement
{
    //signalement composé d'1 sujet,d'1 message, d'1 mail (lié à la pers. qui l'envoie) + doc a la limite
    public readonly string $id_signalement;
    public string $sujet;
    public string $message;
    public readonly string $mail;
    public readonly string $date_creation;
    public readonly string $id_pers_signal;
    public string $status; 

    public function __construct(array $data = array())
    {
        $this->id_signalement = $data['id_signalement'] ?? -1;
        $this->sujet = $data['sujet'] ?? '';
        $this->message = $data['message'] ?? '';
        $this->mail = $data['mail'] ?? '';
        $this->date_creation = $data['date_creation'] ?? '';
        $this->id_pers_signal = $data['id_pers_signal'] ?? '';
        $this->status = $data['status'] ?? 'ouvert'; 

}
}
?>