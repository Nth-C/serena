<?php
class audit
{
  public string $id_audit; 
  public string $operation;
  public string $user_name; 
  public string $table_name;
  public string $schema_name;
  public string $old_values; 
  public string $new_values;
  public string $query_text;
  public ?string $id_famille_audit; 
  public string $action_tstamp; 

  public function __construct(array $data = array())
  {
    $this->id_audit = $data['id_audit'] ?? ''; 
    $this->operation = $data['operation'] ?? '';
    $this->user_name = $data['user_name'] ?? 'Inconnu'; // Valeur par défaut
    
    $this->table_name = $data['table_name'] ?? '';
    $this->schema_name = $data['schema_name'] ?? '';
    $this->old_values = $data['old_values'] ?? '';
    $this->new_values = $data['new_values'] ?? '';
    $this->query_text = $data['query_text'] ?? '';
    $this->id_famille_audit = $data['id_famille_audit'] ?? null;
    $this->action_tstamp = $data['action_tstamp'] ?? '';
  }
}
?>