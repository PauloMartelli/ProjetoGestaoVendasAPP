import { HTTPClient } from "./client";

export const vendas = {
    async obterVendasAsync() {
        try {
            const response = await HTTPClient.get("/vendas/listar");
            return response.data;
        } catch (error) {
            console.error('Erro ao obter as vendas:', error);
            throw error;
        }
    },

    async adicionarVendaAsync(venda) {
        try {
            const response = await HTTPClient.post("/vendas/criar", venda);
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar a venda:', error);
            throw error;
        }
    },

    async obterVendaPorIdAsync(id) {
        try {
            const response = await HTTPClient.get(`/vendas/obter/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao obter a venda com ID ${id}:`, error);
            throw error;
        }
    },

    async atualizarVendaAsync(venda, id) {
        try {
            await HTTPClient.put(`/vendas/atualizar/${id}`, venda);
        } catch (error) {
            console.error('Erro ao atualizar a venda:', error);
            throw error;
        }
    },

    async desativarVendaAsync(id) {
        try {
            await HTTPClient.delete(`/vendas/deletar/${id}`);
        } catch (error) {
            console.error(`Erro ao desativar a venda com ID ${id}:`, error);
            throw error;
        }
    }
};