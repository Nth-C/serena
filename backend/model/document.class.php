<?php

class Document
{
    public readonly int $id_document;
    public string $url;
    public string $nom_doc;
    public string $type;
    public int $id_cat;

    public function __construct(array $data = array())
    {
        $this->id_document = $data['id_doc'] ?? -1;
        $this->url = $data['url'] ?? '';
        $this->nom_doc = $data['nom_doc'] ?? '';
        $this->type = $data['type'] ?? '';
        $this->id_cat = $data['id_cat'] ?? -1;
    }


}
