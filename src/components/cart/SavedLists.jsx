import React from 'react';
import { Trash2, X } from 'lucide-react';
import { Button, Card, IconButton, Input } from '../ui';

export function SaveListForm({ newListName, setNewListName, onConfirmSaveList, cancelSaveList }) {
    return (
        <Card className="mb-4 animate-dialog-in">
            <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    onConfirmSaveList();
                }}
            >
                <Input
                    label="Nombre de la lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Ej. Despensa semanal"
                    autoFocus
                    className="flex-1"
                />
                <Button type="submit" variant="brand">Guardar</Button>
                <IconButton icon={X} label="Cancelar" onClick={cancelSaveList} />
            </form>
        </Card>
    );
}

// `bleedClass` alinea el carrusel con el relleno del contenedor (página: -mx-4 px-4; drawer: -mx-5 px-5)
export function SavedLists({ savedLists, loadList, deleteList, bleedClass = '-mx-4 px-4' }) {
    return (
        <section className="mt-8 border-t border-border pt-6" aria-labelledby="saved-lists-title">
            <h2 id="saved-lists-title" className="mb-3 text-base font-bold text-ink">Mis listas guardadas</h2>
            <ul className={`hide-scrollbar flex list-none gap-3 overflow-x-auto pb-2 ${bleedClass}`}>
                {savedLists.map(list => (
                    <Card as="li" key={list.id} className="flex min-w-52 flex-col gap-3 border border-border">
                        <div>
                            <p className="font-semibold text-ink">{list.name}</p>
                            <p className="text-sm text-subtle">{list.items.length} artículos · {list.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="brand" size="sm" fullWidth onClick={() => loadList(list)}>
                                Cargar
                            </Button>
                            <IconButton
                                icon={Trash2}
                                size={18}
                                variant="danger"
                                label={`Eliminar lista ${list.name}`}
                                onClick={() => deleteList(list.id)}
                            />
                        </div>
                    </Card>
                ))}
            </ul>
        </section>
    );
}
