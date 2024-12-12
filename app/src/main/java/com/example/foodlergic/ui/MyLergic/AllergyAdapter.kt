package com.example.foodlergic.ui.MyLergic

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Switch
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.foodlergic.R
import com.example.foodlergic.data.models.Allergy

class AllergyAdapter(
) : ListAdapter<Allergy, AllergyAdapter.AllergyViewHolder>(DIFF_CALLBACK) {

    class AllergyViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val cardView: CardView = view.findViewById(R.id.cardView)
        val imageView: ImageView = view.findViewById(R.id.imageView)
        val allergySwitch: Switch = view.findViewById(R.id.switchAlergic)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AllergyViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.switch_button, parent, false)
        return AllergyViewHolder(view)
    }

    override fun onBindViewHolder(holder: AllergyViewHolder, position: Int) {
        val allergy = getItem(position)
        Log.d("rezon-dbg", "allergy: ${allergy.name} , ${allergy.isChecked}")
        holder.allergySwitch.text = allergy.formatName()
        holder.allergySwitch.isChecked = allergy.isChecked
        holder.imageView.setImageResource(mapAllergyToImageRes(allergy.name))


        holder.allergySwitch.setOnClickListener { view ->
            val switchView = view as Switch
            Log.d("rezon-dbg", "isChecked change: ${view.isChecked}")
            allergy.isChecked = switchView.isChecked
            notifyItemChanged(position)
        }
    }

    private fun mapAllergyToImageRes(name: String): Int {
        return when (name) {
            "ayam" -> R.drawable.ic_ayam
            "coklat" -> R.drawable.ic_coklat
            "gandum" -> R.drawable.ic_gandum
            "ikan" -> R.drawable.ic_ikan
            "kacang_kedelai" -> R.drawable.ic_kacang_kedelai
            "kacang_tanah" -> R.drawable.ic_kacang_tanah
            "kerang" -> R.drawable.ic_kerang
            "sapi" -> R.drawable.ic_sapi
            "susu" -> R.drawable.ic_susu
            "telur" -> R.drawable.ic_telur
            "udang" -> R.drawable.ic_udang
            "wijen" -> R.drawable.ic_wijen
            else -> R.drawable.ic_baseline_account_circle_24 // gambar default
        }
    }

    companion object {
        val DIFF_CALLBACK = object : DiffUtil.ItemCallback<Allergy>() {
            override fun areItemsTheSame(
                oldItem: Allergy,
                newItem: Allergy
            ): Boolean {
                return oldItem.name == newItem.name
            }

            override fun areContentsTheSame(
                oldItem: Allergy,
                newItem: Allergy
            ): Boolean {
                return oldItem == newItem
            }
        }
    }
}
