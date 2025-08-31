public class Usuario {
    private int id;
    private String login;
    private String senha;
    private Character sexo;

    public Usuario(Integer id, String login, String senha, Character sexo) {
        this.id = id != null ? id : -1;
        this.login = login;
        this.senha = senha;
        this.sexo = sexo;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }
    public String getSenha() {
        return senha;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public Character getSexo() {
        return sexo;
    }
    public void setSexo(Character sexo) {
        this.sexo = sexo;
    }

    @Override
    public String toString() {
        return "Usuario{" + "id=" + id + ", login=" + login + ", senha=" + senha + ", sexo=" + sexo + '}';
    }
}
