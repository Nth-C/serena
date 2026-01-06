<?php

class Document
{
    public readonly int $id_document;
    public string $url;
    public string $nom_doc;
    public string $type;
    public readonly int $id_cat;

    public function __construct(array $data = array())
    {
        $this->id_document = $data['id_document'] ?? -1;
        $this->url = $url['url'] ?? '';
        $this->nom_doc = $data['nom_doc'] ?? '';
        $this->type = $type['type'] ?? '';
        $this->id_cat = $id_cat['id_cat'] ?? -1;
    }

    public function addDocument(): array
    {
        return $this->dao->getOrdonnances($this);
    }



}
