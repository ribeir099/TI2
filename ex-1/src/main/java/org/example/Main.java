package org.example;

import java.util.Scanner;

public class Main {
    public static Scanner scanner = new Scanner(System.in);
    public static void main(String[] args) {
        int num1, num2, soma;

        System.out.print("Digite o primeiro número: ");
        num1 = scanner.nextInt();
        System.out.print("Digite o segundo número: ");
        num2 = scanner.nextInt();

        soma = Sum.sum_2(num1, num2);

        System.out.println("A soma dos números " + num1 + " + " + num2 + " = " + soma);
    }
}
