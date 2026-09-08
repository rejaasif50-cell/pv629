import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CardService } from '../../types';
import {
  CreditCard,
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Search
} from 'lucide-react';

export const AdminServicesTab: React.FC = () => {
  const { services, addService, updateService, deleteService, showToast } = useApp();

  const [editingService, setEditingService] = useState<CardService | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Government ID');
  const [price, setPrice] = useState(99);
  const [offerPrice, setOfferPrice] = useState(69);
  const [description, setDescription] = useState('');
  const [uploadRequirements, setUploadRequirements] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('24 Hours Dispatch');
  const [badge, setBadge] = useState('');
  const [active, setActive] = useState(true);

  const openNewServiceModal = () => {
    setIsNew(true);
    setEditingService({
      id: '',
      name: '',
      category: 'Government ID',
      price: 99,
      offerPrice: 69,
      description: '',
      uploadRequirements: 'Upload clear official e-document or original image',
      turnaroundTime: '24 Hours Dispatch',
      deliveryCharge: 40,
      active: true
    });
    setName('');
    setCategory('Government ID');
    setPrice(99);
    setOfferPrice(69);
    setDescription('');
    setUploadRequirements('Upload clear official e-document or original image');
    setTurnaroundTime('24 Hours Dispatch');
    setBadge('');
    setActive(true);
  };

  const openEditModal = (service: CardService) => {
    setIsNew(false);
    setEditingService(service);
    setName(service.name);
    setCategory(service.category);
    setPrice(service.price);
    setOfferPrice(service.offerPrice);
    setDescription(service.description);
    setUploadRequirements(service.uploadRequirements);
    setTurnaroundTime(service.turnaroundTime);
    setBadge(service.badge || '');
    setActive(service.active);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter service name', 'error');
      return;
    }

    if (isNew) {
      addService({
        name: name.trim(),
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
        description: description.trim(),
        uploadRequirements: uploadRequirements.trim(),
        turnaroundTime: turnaroundTime.trim(),
        deliveryCharge: 40,
        badge: badge.trim() || undefined,
        active
      });
      showToast(`Added card service: ${name}`, 'success');
    } else if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
        description: description.trim(),
        uploadRequirements: uploadRequirements.trim(),
        turnaroundTime: turnaroundTime.trim(),
        badge: badge.trim() || undefined,
        active
      });
      showToast(`Updated card service: ${name}`, 'success');
    }

    setEditingService(null);
  };

  const handleDelete = (id: string, serviceName: string) => {
    if (confirm(`Are you sure you want to delete ${serviceName}?`)) {
      deleteService(id);
      showToast(`Deleted service ${serviceName}`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Card Services & Pricing</h1>
          <p className="text-xs text-slate-500">
            Control the catalog of PVC card services, regular price vs offer price, badges, and upload guidelines.
          </p>
        </div>

        <button
          onClick={openNewServiceModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Card Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Card Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Regular Price</th>
                <th className="py-3 px-4">Offer Price</th>
                <th className="py-3 px-4">Turnaround</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {s.name}
                    <span className="block text-[11px] text-slate-400 font-normal truncate max-w-xs">
                      {s.description}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {s.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 line-through">₹{s.price}</td>
                  <td className="py-3 px-4 font-black text-slate-900 text-sm">₹{s.offerPrice}</td>
                  <td className="py-3 px-4 text-slate-600">{s.turnaroundTime}</td>
                  <td className="py-3 px-4">
                    {s.badge ? (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {s.badge}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updateService(s.id, { active: !s.active })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                {isNew ? 'Add New PVC Card Service' : `Edit ${editingService.name}`}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aadhaar PVC Card Print"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Government ID">Government ID</option>
                    <option value="Tax & Finance">Tax & Finance</option>
                    <option value="Health & Welfare">Health & Welfare</option>
                    <option value="Vehicle & Transport">Vehicle & Transport</option>
                    <option value="Social Schemes">Social Schemes</option>
                    <option value="Education & Office">Education & Office</option>
                    <option value="Custom & Other">Custom & Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    placeholder="e.g. Best Seller, Popular"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={e => setOfferPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description for customer catalog..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={turnaroundTime}
                    onChange={e => setTurnaroundTime(e.target.value)}
                    placeholder="e.g. 24 Hours Dispatch"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Upload Guideline</label>
                  <input
                    type="text"
                    value={uploadRequirements}
                    onChange={e => setUploadRequirements(e.target.value)}
                    placeholder="e.g. Upload e-Aadhaar PDF or clear photo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="active-checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="active-checkbox" className="font-bold text-slate-700">
                  Service is active and visible on customer order page
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
