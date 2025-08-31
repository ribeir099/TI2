import java.sql.*;
import java.security.*;
import java.math.*;

public class DAO {
    protected Connection con;
    boolean connectionStatus = false;

    public DAO(){
        con = null;
        connect();
    }

    public boolean connect(){
        String driverName = "org.postgresql.Driver";
        String serverName = "localhost";
        String databaseName = "database";
        int serverPort = 5432;
        String url = "jdbc:postgresql://" + serverName + ":" + serverPort + "/" + databaseName;
        String username = "usuario";
        String password = "senha";

        try{
            Class.forName(driverName);
            con = DriverManager.getConnection(url, username, password);
            connectionStatus = true;
            System.out.println("Conectado com sucesso!");
        } catch (ClassNotFoundException e){
            System.out.println("Erro ao realizar a conexao, driver nao encontrado! " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("Erro ao conectar com o banco de dados " + e.getMessage());
        }

        return connectionStatus;
    }

    public boolean disconnect(){
        try{
            con.close();
            connectionStatus = false;
        } catch (SQLException e){
            System.out.println("Erro ao desconectar com o banco de dados " + e.getMessage());
        }

        return connectionStatus;
    }
}
