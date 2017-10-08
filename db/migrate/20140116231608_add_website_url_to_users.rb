# rubocop:disable all
class AddWebsiteUrlToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :website_url, :string, {:null => false, :default => ''}
  end
end
